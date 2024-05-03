"use client";

import { DEBOUNCE_DELAY } from "@/data/constant";
import { useEffect, useRef, useState } from "react";

export default function useDebounce(DELAY = DEBOUNCE_DELAY) {
  const [inputValue, setInputValue] = useState("");
  const [searchResult, setSearchResult] = useState("");

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function queryFunction(value: string) {
    setSearchResult(value);
  }

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      queryFunction(inputValue);
      timeoutRef.current = null;
    }, DELAY);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [inputValue]);

  return {
    inputValue,
    setInputValue,
    searchResult,
    setSearchResult,
  };
}
