import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";

export const useIdleTimeout = (timeout: number = 1800000) => { // 30 minutos por padrão
  const { logout } = useAuth();
  const navigate = useNavigate();
  const timeoutRef = useRef<NodeJS.Timeout>();

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      logout();
      navigate("/login");
    }, timeout);
  };

  useEffect(() => {
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
    ];

    const resetOnActivity = () => {
      resetTimeout();
    };

    // Inicializa o timeout
    resetTimeout();

    // Adiciona os event listeners
    events.forEach((event) => {
      document.addEventListener(event, resetOnActivity);
    });

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach((event) => {
        document.removeEventListener(event, resetOnActivity);
      });
    };
  }, [timeout, logout, navigate]);
};