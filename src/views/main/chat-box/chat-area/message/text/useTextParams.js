import { useCallback, useLayoutEffect, useRef, useState } from "react";

export const MAX_HEIGHT = window.innerHeight - 220;

export default function useTextParams() {
    const [more, setMore] = useState(false)
    const [step, setStep] = useState(1);
    const rootRef = useRef();

    const handleAddStep = useCallback(() => {
        setStep(step => step + 1);
    }, []);

    useLayoutEffect(() => {
      const root = rootRef.current;
      const handleResizeObservable = _height => {
        const height = _height || root.getBoundingClientRect().height;
        if(height >= MAX_HEIGHT * step && !more) setMore(true);
        if(height < MAX_HEIGHT * step && more) setMore(false);
      };
      const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          const { height } = entry.contentRect;
          handleResizeObservable(height);
        }
      });

      if (root) { 
          handleResizeObservable();
          resizeObserver.observe(root);
      }
      return () => {
        resizeObserver.disconnect();
      };
    }, [step, more]);

    return [
        { step, more, MAX_HEIGHT, rootRef },  
        { handleAddStep }
    ]
}

export const getSize = (defaultSize, len) => ({
    1: '250%',
    2: '250%',
    3: '200%',
    4: '200%',
    5: '200%',
    6: '150%'
  })[len] || defaultSize;

export function containsNonEmojiText(input) {
    const emojiRegex = /[\p{Emoji}]/gu;
    const textWithoutEmoji = input.replace(emojiRegex, '');
    return textWithoutEmoji.trim() !== '';
}