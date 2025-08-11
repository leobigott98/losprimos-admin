// hooks/useOrdersWS.ts
import { useEffect, useRef } from 'react';
import { mutate } from 'swr';

type ServerMessage =
  | { type: 'newOrder'; data?: any }
  | { type: 'ping' }
  | { type: 'pong' }
  | { type: string; [key: string]: any };

interface UseOrdersWSProps {
  query: string;
  currentPage: number;
  onNewOrderAudio?: HTMLAudioElement | null;
}

export default function useOrdersWS({ query, currentPage, onNewOrderAudio }: UseOrdersWSProps) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectDelayRef = useRef(1000); // start with 1s
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const stoppedRef = useRef(false);

  const WS_URL = process.env.NEXT_PUBLIC_WS_URL;

  /** Schedule reconnect with exponential backoff */
  const scheduleReconnect = () => {
    if (stoppedRef.current) return;
    const delay = Math.min(reconnectDelayRef.current, 30000); // max 30s
    console.log(`🔄 WS reconnecting in ${delay}ms`);
    reconnectTimerRef.current = setTimeout(connect, delay);
    reconnectDelayRef.current = Math.min(30000, reconnectDelayRef.current * 1.5 + Math.random() * 500);
  };

  const clearReconnect = () => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    reconnectDelayRef.current = 1000; // reset delay
  };

  /** Send app-level ping every 25s */
  const startPing = () => {
    stopPing();
    pingTimerRef.current = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'ping' }));
      }
    }, 25000);
  };

  const stopPing = () => {
    if (pingTimerRef.current) {
      clearInterval(pingTimerRef.current);
      pingTimerRef.current = null;
    }
  };

  const closeWs = () => {
    stopPing();
    clearReconnect();
    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch {}
      wsRef.current = null;
    }
  };

  const connect = () => {
    if (!WS_URL) {
      console.error('❌ NEXT_PUBLIC_WS_URL not set');
      return;
    }

    stoppedRef.current = false;
    clearReconnect();

    try {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('✅ WS connected');
        reconnectDelayRef.current = 1000; // reset backoff
        startPing();
      };

      ws.onmessage = (event: MessageEvent) => {
        let msg: ServerMessage;
        try {
          msg = JSON.parse(event.data);
        } catch {
          return;
        }

        if (msg.type === 'newOrder') {
          mutate(`/api/orders?query=${query}&page=${currentPage}`);
          if (onNewOrderAudio) {
            onNewOrderAudio.play().catch(() => {});
          }
        } else if (msg.type === 'ping') {
          ws.send(JSON.stringify({ type: 'pong' }));
        }
      };

      ws.onclose = (ev) => {
        console.warn(`⚠️ WS closed (${ev.code}): ${ev.reason}`);
        stopPing();
        if (!stoppedRef.current) scheduleReconnect();
      };

      ws.onerror = (err) => {
        console.error('⚠️ WS error', err);
        ws.close();
      };
    } catch (err) {
      console.error('❌ WS connection error', err);
      scheduleReconnect();
    }
  };

  useEffect(() => {
    connect();
    return () => {
      stoppedRef.current = true;
      closeWs();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** If query/page changes, refresh SWR but don't reconnect WS */
  useEffect(() => {
    mutate(`/api/orders?query=${query}&page=${currentPage}`);
  }, [query, currentPage]);

  return {
    send: (obj: Record<string, any>) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify(obj));
      }
    },
    close: () => {
      stoppedRef.current = true;
      closeWs();
    }
  };
}
