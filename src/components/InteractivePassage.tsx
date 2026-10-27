import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Bookmark, Check, Volume2, X, Sparkles, BookOpen } from 'lucide-react';
import { CEFRLevel, VocabularyAnnotation } from '../types/reading';
import {
  extractSentenceWithOffset,
  lookupPassageWord,
  normalizeLookupToken,
  stripSurroundingPunctuation,
} from '../services/wordLookupService';

interface InteractivePassageProps {
  lessonId: string;
  lessonLevel?: CEFRLevel;
  paragraphs: string[];
  vocabulary: VocabularyAnnotation[];
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  savedWordIds: Set<string>;
  onToggleSaveWord: (vocab: VocabularyAnnotation) => void;
  showArabicTranslation?: boolean;
  highlightedEvidenceQuote?: string | null;
}

interface WordPiece {
  raw: string;
  leading: string;
  core: string;
  trailing: string;
  normalized: string;
  charOffset: number;
}

interface Segment {
  text: string;
  vocab?: VocabularyAnnotation;
  occurrenceIdx?: number;
  startOffset: number;
  wordPieces?: WordPiece[];
}

interface PopupPosition {
  top: number;
  left: number;
  placement: 'top' | 'bottom';
  arrowLeft: number;
  ready: boolean;
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeEvidenceString(str: string): string {
  return str
    .toLowerCase()
    .replace(/[“”‘’"']/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function doesParagraphContainEvidence(
  paragraphText: string,
  quote: string | null | undefined
): boolean {
  if (!quote) return false;
  const cleanedQuote = quote
    .replace(/^(?:\.\.\.|…)+|(?:\.\.\.|…)+$/g, '')
    .trim();
  if (!cleanedQuote) return false;

  const normPara = normalizeEvidenceString(paragraphText);
  const normWhole = normalizeEvidenceString(cleanedQuote);
  if (normWhole && normPara.includes(normWhole)) {
    return true;
  }

  const chunks = cleanedQuote
    .split(/(?:\.\.\.|…)+/)
    .map((chunk) => normalizeEvidenceString(chunk))
    .filter((chunk) => chunk.length >= 6);

  if (chunks.length > 0 && chunks.every((chunk) => normPara.includes(chunk))) {
    return true;
  }

  return false;
}

/**
 * Splits a plain text segment into whitespace/punctuation and individual word tokens
 * so every word in the passage can be hovered, double-clicked, or tapped without permanent highlighting.
 */
export function tokenizePlainSegment(text: string, segmentStartOffset: number): WordPiece[] {
  const pieces: WordPiece[] = [];
  const tokenRegex = /(\S+|\s+)/g;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(text)) !== null) {
    const raw = match[0];
    const tokenOffset = segmentStartOffset + match.index;

    if (/^\s+$/.test(raw)) {
      pieces.push({
        raw,
        leading: raw,
        core: '',
        trailing: '',
        normalized: '',
        charOffset: tokenOffset,
      });
      continue;
    }

    // Also split em-dashes or slashes between words so each word is independently selectable
    const subParts = raw.split(/([—–/]+)/);
    if (subParts.length > 1) {
      let runningOffset = tokenOffset;
      for (const part of subParts) {
        if (!part) continue;
        if (/^[—–/]+$/.test(part)) {
          pieces.push({
            raw: part,
            leading: part,
            core: '',
            trailing: '',
            normalized: '',
            charOffset: runningOffset,
          });
        } else {
          const { leading, core, trailing } = stripSurroundingPunctuation(part);
          const normalized = core ? normalizeLookupToken(core) : '';
          pieces.push({
            raw: part,
            leading,
            core,
            trailing,
            normalized,
            charOffset: runningOffset + leading.length,
          });
        }
        runningOffset += part.length;
      }
      continue;
    }

    const { leading, core, trailing } = stripSurroundingPunctuation(raw);
    const normalized = core ? normalizeLookupToken(core) : '';
    pieces.push({
      raw,
      leading,
      core,
      trailing,
      normalized,
      charOffset: tokenOffset + leading.length,
    });
  }

  return pieces;
}

/**
 * Returns the primary client rect for an inline element even if a multi-word phrase wraps across lines.
 */
function getPrimaryAnchorRect(el: HTMLElement): DOMRect {
  const rects = el.getClientRects();
  if (rects && rects.length > 0) {
    return rects[0];
  }
  return el.getBoundingClientRect();
}

const VIEWPORT_MARGIN = 12;
const NAVBAR_SAFE_TOP = 72;
const POPUP_OFFSET_GAP = 10;
export const HOVER_OPEN_DELAY_MS = 400;
const HOVER_CLOSE_DELAY_MS = 180;

export const InteractivePassage: React.FC<InteractivePassageProps> = ({
  lessonId,
  lessonLevel,
  paragraphs,
  vocabulary,
  fontSize,
  savedWordIds,
  onToggleSaveWord,
  highlightedEvidenceQuote,
}) => {
  const [activeVocab, setActiveVocab] = useState<VocabularyAnnotation | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [pinnedByClick, setPinnedByClick] = useState<boolean>(false);
  const [popupPos, setPopupPos] = useState<PopupPosition>({
    top: 0,
    left: 0,
    placement: 'top',
    arrowLeft: 180,
    ready: false,
  });

  const anchorElRef = useRef<HTMLElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const hoverOpenTimerRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const clearHoverOpenTimer = useCallback(() => {
    if (hoverOpenTimerRef.current !== null) {
      window.clearTimeout(hoverOpenTimerRef.current);
      hoverOpenTimerRef.current = null;
    }
  }, []);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const closePopup = useCallback(() => {
    clearHoverOpenTimer();
    clearCloseTimer();
    setActiveVocab(null);
    setAnchorEl(null);
    setPinnedByClick(false);
    anchorElRef.current = null;
    setPopupPos((prev) => (prev.ready ? { ...prev, ready: false } : prev));
  }, [clearHoverOpenTimer, clearCloseTimer]);

  const scheduleClose = useCallback(() => {
    clearHoverOpenTimer();
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      setActiveVocab(null);
      setAnchorEl(null);
      setPinnedByClick(false);
      anchorElRef.current = null;
      setPopupPos((prev) => (prev.ready ? { ...prev, ready: false } : prev));
    }, HOVER_CLOSE_DELAY_MS);
  }, [clearHoverOpenTimer, clearCloseTimer]);

  // Reset popup when switching lessons
  useEffect(() => {
    closePopup();
  }, [lessonId, closePopup]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      clearHoverOpenTimer();
      clearCloseTimer();
    };
  }, [clearHoverOpenTimer, clearCloseTimer]);

  // Smoothly scroll highlighted evidence paragraph into view when student clicks "Locate in Passage"
  useEffect(() => {
    if (!highlightedEvidenceQuote) return;
    const highlightedEl = document.querySelector('[data-evidence-highlighted="true"]');
    if (highlightedEl instanceof HTMLElement) {
      highlightedEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [highlightedEvidenceQuote]);

  const isVocabSaved = useCallback(
    (vocab: VocabularyAnnotation | null): boolean => {
      if (!vocab) return false;
      return (
        savedWordIds.has(vocab.id) ||
        savedWordIds.has(vocab.word.toLowerCase()) ||
        savedWordIds.has(normalizeLookupToken(vocab.word))
      );
    },
    [savedWordIds]
  );

  // Compute floating position relative to anchor element without affecting document layout
  const updatePopupPosition = useCallback(() => {
    const currentAnchor = anchorElRef.current;
    const popoverEl = popoverRef.current;
    if (!currentAnchor || !popoverEl) return;

    const fullBounds = currentAnchor.getBoundingClientRect();
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;

    // If the anchor word has scrolled completely out of the visible viewport, dismiss cleanly
    if (fullBounds.bottom < 0 || fullBounds.top > viewportH) {
      closePopup();
      return;
    }

    const anchorRect = getPrimaryAnchorRect(currentAnchor);
    const popupRect = popoverEl.getBoundingClientRect();
    const popupW = popupRect.width || Math.min(356, viewportW - VIEWPORT_MARGIN * 2);
    const popupH = popupRect.height || 210;

    // Determine vertical placement: prefer 'top' (above the word) when there is enough space
    const minTopBoundary = anchorRect.top > NAVBAR_SAFE_TOP ? NAVBAR_SAFE_TOP : VIEWPORT_MARGIN;
    const availableAbove = anchorRect.top - minTopBoundary;
    const availableBelow = viewportH - fullBounds.bottom - VIEWPORT_MARGIN;

    let placement: 'top' | 'bottom' = 'top';
    let top = anchorRect.top - popupH - POPUP_OFFSET_GAP;

    if (availableAbove >= popupH + POPUP_OFFSET_GAP) {
      placement = 'top';
      top = anchorRect.top - popupH - POPUP_OFFSET_GAP;
    } else if (availableBelow >= popupH + POPUP_OFFSET_GAP || availableBelow >= availableAbove) {
      placement = 'bottom';
      top = Math.min(
        viewportH - popupH - VIEWPORT_MARGIN,
        Math.max(VIEWPORT_MARGIN, fullBounds.bottom + POPUP_OFFSET_GAP)
      );
    } else {
      placement = 'top';
      top = Math.max(VIEWPORT_MARGIN, anchorRect.top - popupH - POPUP_OFFSET_GAP);
    }

    // Determine horizontal placement: center on the word, clamped inside viewport edges
    const anchorCenterX = anchorRect.left + anchorRect.width / 2;
    const idealLeft = anchorCenterX - popupW / 2;
    const maxLeft = Math.max(VIEWPORT_MARGIN, viewportW - popupW - VIEWPORT_MARGIN);
    const left = Math.max(VIEWPORT_MARGIN, Math.min(idealLeft, maxLeft));

    // Position the directional arrow to point directly at the word
    const arrowLeft = Math.max(20, Math.min(anchorCenterX - left, popupW - 20));

    setPopupPos((prev) => {
      if (
        prev.ready &&
        Math.abs(prev.top - top) < 0.5 &&
        Math.abs(prev.left - left) < 0.5 &&
        prev.placement === placement &&
        Math.abs(prev.arrowLeft - arrowLeft) < 0.5
      ) {
        return prev;
      }
      return {
        top,
        left,
        placement,
        arrowLeft,
        ready: true,
      };
    });
  }, [closePopup]);

  // Measure immediately before browser paint when activeVocab, anchorEl, or saved state changes
  useLayoutEffect(() => {
    if (!activeVocab || !anchorEl) return;
    updatePopupPosition();
  }, [activeVocab, anchorEl, savedWordIds, updatePopupPosition]);

  // Reposition smoothly on window scroll or resize without causing layout shift
  useEffect(() => {
    if (!activeVocab) return;

    const handleScrollOrResize = () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = window.requestAnimationFrame(() => {
        updatePopupPosition();
      });
    };

    window.addEventListener('scroll', handleScrollOrResize, { passive: true, capture: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });

    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [activeVocab, updatePopupPosition]);

  // Escape key & outside tap/click dismissal
  useEffect(() => {
    if (!activeVocab) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closePopup();
      }
    };

    const handlePointerDownOutside = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (popoverRef.current?.contains(target)) return;
      if (anchorElRef.current?.contains(target)) return;
      if (target.closest('[data-vocab-trigger="true"]')) return;
      if (target.closest('[data-word-lookup="true"]')) return;
      closePopup();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDownOutside);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDownOutside);
    };
  }, [activeVocab, closePopup]);

  const fontSizeClasses: Record<'sm' | 'md' | 'lg' | 'xl', string> = {
    sm: 'text-[16px] leading-[1.72]',
    md: 'text-[18.5px] leading-[1.78]',
    lg: 'text-[21px] leading-[1.82]',
    xl: 'text-[23.5px] leading-[1.86]',
  };

  const speakWord = (word: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-GB';
      utterance.rate = 0.92;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Tokenize all paragraphs: keep curated vocabulary highlighted, and split remaining text into interactive words
  const renderedParagraphs = React.useMemo(() => {
    const hasCuratedVocab = Boolean(vocabulary && vocabulary.length > 0);

    const sortedVocab = hasCuratedVocab
      ? [...vocabulary].sort((a, b) => {
          const aLen = (a.matchedText || a.word).length;
          const bLen = (b.matchedText || b.word).length;
          return bLen - aLen;
        })
      : [];

    const patternParts = sortedVocab
      .flatMap((v) => [v.matchedText?.trim(), v.word.trim()])
      .filter((w): w is string => Boolean(w))
      .map((w) => escapeRegExp(w));

    const regex =
      patternParts.length > 0 ? new RegExp(`\\b(${patternParts.join('|')})\\b`, 'gi') : null;
    const occurrenceCounter: Record<string, number> = {};
    const matchedOnce = new Set<string>();

    return paragraphs.map((paragraph) => {
      if (!regex) {
        return [
          {
            text: paragraph,
            startOffset: 0,
            wordPieces: tokenizePlainSegment(paragraph, 0),
          } as Segment,
        ];
      }

      const segments: Segment[] = [];
      let lastIndex = 0;
      let match: RegExpExecArray | null;

      regex.lastIndex = 0;
      while ((match = regex.exec(paragraph)) !== null) {
        const matchedText = match[0];
        const startIdx = match.index;

        if (startIdx > lastIndex) {
          const plainSlice = paragraph.slice(lastIndex, startIdx);
          segments.push({
            text: plainSlice,
            startOffset: lastIndex,
            wordPieces: tokenizePlainSegment(plainSlice, lastIndex),
          });
        }

        const lowerKey = matchedText.toLowerCase();
        const zeroBasedIdx = occurrenceCounter[lowerKey] ?? 0;
        occurrenceCounter[lowerKey] = zeroBasedIdx + 1;

        const vocabEntry = sortedVocab.find((v) => {
          const targetSurface = (v.matchedText || v.word).trim().toLowerCase();
          const targetWord = v.word.trim().toLowerCase();
          if (targetSurface !== lowerKey && targetWord !== lowerKey) return false;
          if (matchedOnce.has(v.id)) return false;

          if (typeof v.occurrenceIndex === 'number' && v.occurrenceIndex > 0) {
            return zeroBasedIdx === v.occurrenceIndex || zeroBasedIdx + 1 === v.occurrenceIndex;
          }
          return true;
        });

        if (vocabEntry) {
          matchedOnce.add(vocabEntry.id);
          segments.push({
            text: matchedText,
            vocab: vocabEntry,
            occurrenceIdx: zeroBasedIdx,
            startOffset: startIdx,
          });
        } else {
          segments.push({
            text: matchedText,
            startOffset: startIdx,
            wordPieces: tokenizePlainSegment(matchedText, startIdx),
          });
        }

        lastIndex = startIdx + matchedText.length;
      }

      if (lastIndex < paragraph.length) {
        const remainingSlice = paragraph.slice(lastIndex);
        segments.push({
          text: remainingSlice,
          startOffset: lastIndex,
          wordPieces: tokenizePlainSegment(remainingSlice, lastIndex),
        });
      }

      return segments;
    });
  }, [paragraphs, vocabulary]);

  // Resolve any unhighlighted word or multi-word expression into a contextual English-to-English VocabularyAnnotation
  const resolveWordAnnotation = useCallback(
    (rawWord: string, paragraphText: string, charOffset: number): VocabularyAnnotation | null => {
      const { sentence, offsetInSentence } = extractSentenceWithOffset(paragraphText, charOffset);
      return lookupPassageWord({
        rawWord,
        sentence,
        charOffsetInSentence: offsetInSentence,
        paragraph: paragraphText,
        lessonId,
        lessonLevel,
        curatedVocabulary: vocabulary,
      });
    },
    [lessonId, lessonLevel, vocabulary]
  );

  // Desktop hover (350–500ms delay -> 400ms) for curated vocabulary or any passage word
  const scheduleHoverOpen = useCallback(
    (targetEl: HTMLElement, resolveVocab: () => VocabularyAnnotation | null) => {
      clearCloseTimer();
      clearHoverOpenTimer();

      hoverOpenTimerRef.current = window.setTimeout(() => {
        const resolved = resolveVocab();
        if (!resolved) return;
        if (pinnedByClick && activeVocab?.id !== resolved.id) {
          return;
        }
        anchorElRef.current = targetEl;
        setAnchorEl(targetEl);
        setActiveVocab(resolved);
      }, HOVER_OPEN_DELAY_MS);
    },
    [activeVocab?.id, clearCloseTimer, clearHoverOpenTimer, pinnedByClick]
  );

  const handlePointerEnterCuratedWord = (
    e: React.PointerEvent<HTMLButtonElement>,
    vocab: VocabularyAnnotation
  ) => {
    if (e.pointerType === 'touch') return;
    if (anchorElRef.current === e.currentTarget && activeVocab?.id === vocab.id) {
      clearCloseTimer();
      clearHoverOpenTimer();
      return;
    }
    if (pinnedByClick && activeVocab?.id !== vocab.id) return;
    const targetEl = e.currentTarget;
    scheduleHoverOpen(targetEl, () => vocab);
  };

  const handlePointerEnterPlainWord = (
    e: React.PointerEvent<HTMLSpanElement>,
    rawWord: string,
    paragraphText: string,
    charOffset: number
  ) => {
    if (e.pointerType === 'touch') return;
    if (anchorElRef.current === e.currentTarget && activeVocab) {
      clearCloseTimer();
      clearHoverOpenTimer();
      return;
    }
    if (pinnedByClick) return;
    // If an expression popup is already visible and the user moves the pointer to another constituent word of the same expression, keep it open without flickering
    if (activeVocab) {
      const quickResolved = resolveWordAnnotation(rawWord, paragraphText, charOffset);
      if (quickResolved && quickResolved.id === activeVocab.id) {
        clearCloseTimer();
        clearHoverOpenTimer();
        return;
      }
    }
    const targetEl = e.currentTarget;
    scheduleHoverOpen(targetEl, () =>
      resolveWordAnnotation(rawWord, paragraphText, charOffset)
    );
  };

  const handlePointerLeaveAnyWord = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType === 'touch') return;
    clearHoverOpenTimer();
    if (pinnedByClick) return;
    scheduleClose();
  };

  const handleFocusCuratedWord = (
    e: React.FocusEvent<HTMLButtonElement>,
    vocab: VocabularyAnnotation
  ) => {
    clearCloseTimer();
    clearHoverOpenTimer();
    if (pinnedByClick && activeVocab?.id !== vocab.id) return;
    const targetEl = e.currentTarget;
    anchorElRef.current = targetEl;
    setAnchorEl(targetEl);
    setActiveVocab(vocab);
  };

  const handleBlurWord = (e: React.FocusEvent<HTMLElement>) => {
    clearHoverOpenTimer();
    if (pinnedByClick) return;
    const related = e.relatedTarget as Node | null;
    if (related && popoverRef.current?.contains(related)) {
      return;
    }
    scheduleClose();
  };

  const handleClickCuratedWord = (
    e: React.MouseEvent<HTMLButtonElement>,
    vocab: VocabularyAnnotation
  ) => {
    clearHoverOpenTimer();
    clearCloseTimer();
    const targetEl = e.currentTarget;

    if (activeVocab?.id === vocab.id && pinnedByClick && anchorElRef.current === targetEl) {
      closePopup();
    } else {
      anchorElRef.current = targetEl;
      setAnchorEl(targetEl);
      setActiveVocab(vocab);
      setPinnedByClick(true);
    }
  };

  const handleClickPlainWord = (
    e: React.MouseEvent<HTMLSpanElement>,
    rawWord: string,
    paragraphText: string,
    charOffset: number
  ) => {
    clearHoverOpenTimer();
    clearCloseTimer();
    const targetEl = e.currentTarget;
    const resolved = resolveWordAnnotation(rawWord, paragraphText, charOffset);
    if (!resolved) return;

    if (activeVocab?.id === resolved.id && pinnedByClick && anchorElRef.current === targetEl) {
      closePopup();
    } else {
      anchorElRef.current = targetEl;
      setAnchorEl(targetEl);
      setActiveVocab(resolved);
      setPinnedByClick(true);
    }
  };

  const handleDoubleClickWord = (
    e: React.MouseEvent<HTMLElement>,
    resolveVocab: () => VocabularyAnnotation | null
  ) => {
    e.preventDefault();
    clearHoverOpenTimer();
    clearCloseTimer();
    const targetEl = e.currentTarget;
    const resolved = resolveVocab();
    if (!resolved) return;

    if (typeof window !== 'undefined' && window.getSelection) {
      window.getSelection()?.removeAllRanges();
    }

    anchorElRef.current = targetEl;
    setAnchorEl(targetEl);
    setActiveVocab(resolved);
    setPinnedByClick(true);
  };

  const activeWordSaved = isVocabSaved(activeVocab);

  const floatingPopup =
    activeVocab && typeof document !== 'undefined'
      ? createPortal(
          <div
            ref={popoverRef}
            role="dialog"
            aria-label={`Contextual English explanation for ${activeVocab.word}`}
            onPointerEnter={(e) => {
              if (e.pointerType !== 'touch') {
                clearHoverOpenTimer();
                clearCloseTimer();
              }
            }}
            onPointerLeave={(e) => {
              if (e.pointerType !== 'touch' && !pinnedByClick) {
                scheduleClose();
              }
            }}
            style={{
              position: 'fixed',
              top: `${popupPos.top}px`,
              left: `${popupPos.left}px`,
              zIndex: 60,
              visibility: popupPos.ready ? 'visible' : 'hidden',
              pointerEvents: popupPos.ready ? 'auto' : 'none',
            }}
            className="w-[min(360px,calc(100vw-24px))] rounded-xl border border-[#E3D7C3] bg-[#FFFDFA] shadow-[0_14px_34px_-6px_rgba(23,22,21,0.18),0_4px_12px_-2px_rgba(23,22,21,0.08)]"
          >
            {/* Directional Caret Arrow */}
            <div
              aria-hidden="true"
              style={{ left: `${popupPos.arrowLeft - 6}px` }}
              className={`pointer-events-none absolute h-3 w-3 rotate-45 border-[#E3D7C3] bg-[#FFFDFA] ${
                popupPos.placement === 'top'
                  ? '-bottom-[6.5px] border-r border-b'
                  : '-top-[6.5px] border-t border-l'
              }`}
            />

            {/* Scrollable inner body for long definitions */}
            <div className="max-h-[min(380px,calc(100vh-32px))] overflow-y-auto p-4">
              {/* Header: Word/Expression, Audio, Category/Part of Speech, Save & Close */}
              <div className="flex items-start justify-between gap-2 border-b border-[#E3D7C3] pb-2.5">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <h4 className="font-display text-lg font-bold leading-tight text-[#171615]">
                      {activeVocab.word}
                    </h4>
                    <button
                      type="button"
                      onClick={() => speakWord(activeVocab.word)}
                      title="Listen to pronunciation"
                      aria-label={`Listen to pronunciation of ${activeVocab.word}`}
                      className="inline-flex items-center justify-center rounded-md p-1 text-[#76675B] hover:bg-[#F2EDE3] hover:text-[#171615] transition-colors cursor-pointer"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                    </button>
                    {activeVocab.partOfSpeech && (
                      <span className="font-mono-code text-[11px] font-semibold uppercase tracking-wider text-[#A63816]">
                        {activeVocab.partOfSpeech}
                      </span>
                    )}
                  </div>
                  {activeVocab.matchedText &&
                    activeVocab.matchedText.toLowerCase() !== activeVocab.word.toLowerCase() && (
                      <p className="mt-0.5 text-[11px] text-[#76675B]">
                        In text:{' '}
                        <span className="font-medium italic text-[#171615]">
                          “{activeVocab.matchedText}”
                        </span>
                      </p>
                    )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => onToggleSaveWord(activeVocab)}
                    className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors cursor-pointer ${
                      activeWordSaved
                        ? 'bg-[#287A52] text-white'
                        : 'bg-[#A63816] text-white hover:bg-[#842B12]'
                    }`}
                  >
                    {activeWordSaved ? (
                      <>
                        <Check className="h-3 w-3" />
                        <span>Saved</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="h-3 w-3" />
                        <span>{/\s/.test(activeVocab.word) ? 'Save Phrase' : 'Save Word'}</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={closePopup}
                    aria-label="Close vocabulary popup"
                    className="rounded-md p-1 text-[#76675B] hover:bg-[#F2EDE3] hover:text-[#171615] cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* English-to-English Definitions Stack */}
              <div className="mt-2.5 space-y-2">
                <div className="rounded-lg border border-[#E3D7C3] bg-[#FAF7F1] p-2.5">
                  <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#76675B]">
                    <BookOpen className="h-3 w-3 text-[#A63816]" />
                    <span>English Definition</span>
                  </div>
                  <p className="mt-0.5 text-xs leading-relaxed text-[#171615]">
                    {activeVocab.simpleDefinition}
                  </p>
                </div>

                <div
                  data-vocab-definition="context"
                  className="rounded-lg border border-[#E3D7C3] bg-[#F7E9DC]/70 p-2.5"
                >
                  <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#A63816]">
                    <Sparkles className="h-3 w-3 text-[#A63816]" />
                    <span>Meaning in This Passage</span>
                  </div>
                  <p className="mt-0.5 text-xs leading-relaxed text-[#171615]">
                    {activeVocab.contextMeaning}
                  </p>
                </div>
              </div>

              {/* Example Sentence & Synonyms (shown only when adding value) */}
              {activeVocab.exampleSentence && (
                <div className="mt-2.5 text-[11px] leading-relaxed text-[#76675B]">
                  <span className="font-semibold text-[#171615]">Example: </span>
                  <span className="italic">“{activeVocab.exampleSentence}”</span>
                </div>
              )}

              {activeVocab.synonyms && activeVocab.synonyms.length > 0 && (
                <div className="mt-1.5 text-[11px] text-[#76675B]">
                  <span className="font-semibold text-[#171615]">Synonyms: </span>
                  <span>{activeVocab.synonyms.join(' · ')}</span>
                </div>
              )}
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <div className="relative">
      {floatingPopup}

      {/* Reading Passage Body */}
      <div className={`font-serif-passage text-[#171615] space-y-6 ${fontSizeClasses[fontSize]}`}>
        {renderedParagraphs.map((segments, pIdx) => {
          const fullParagraphText = paragraphs[pIdx] || '';
          const hasEvidence = doesParagraphContainEvidence(
            fullParagraphText,
            highlightedEvidenceQuote
          );

          return (
            <p
              key={pIdx}
              data-evidence-highlighted={hasEvidence ? 'true' : undefined}
              className={`transition-colors duration-200 ${
                hasEvidence
                  ? 'rounded-lg bg-[#E6F2EC]/60 px-3 py-2 border-l-4 border-[#287A52]'
                  : ''
              }`}
            >
              <span
                title={`Paragraph ${pIdx + 1} (${String.fromCharCode(65 + pIdx)})`}
                className="mr-2.5 select-none font-mono-code text-xs font-semibold text-[#76675B]/75"
              >
                [{pIdx + 1} · {String.fromCharCode(65 + pIdx)}]
              </span>
              {segments.map((seg, sIdx) => {
                // 1. Curated vocabulary term (visibly highlighted)
                if (seg.vocab) {
                  const vocabItem = seg.vocab;
                  const isSelected = activeVocab?.id === vocabItem.id;
                  const isSaved = isVocabSaved(vocabItem);

                  return (
                    <button
                      key={`${vocabItem.id}-${sIdx}`}
                      type="button"
                      data-vocab-trigger="true"
                      data-vocab-state={isSelected ? 'selected' : isSaved ? 'saved' : 'default'}
                      aria-expanded={isSelected}
                      aria-haspopup="dialog"
                      onPointerEnter={(e) => handlePointerEnterCuratedWord(e, vocabItem)}
                      onPointerLeave={handlePointerLeaveAnyWord}
                      onFocus={(e) => handleFocusCuratedWord(e, vocabItem)}
                      onBlur={handleBlurWord}
                      onClick={(e) => handleClickCuratedWord(e, vocabItem)}
                      onDoubleClick={(e) => handleDoubleClickWord(e, () => vocabItem)}
                      className={`inline rounded px-1 py-0.5 font-medium transition-colors cursor-pointer border-b-2 ${
                        isSelected
                          ? 'bg-[#A63816] text-white border-[#A63816]'
                          : isSaved
                          ? 'bg-[#E6F2EC]/80 text-[#1E5C3D] border-[#287A52] hover:bg-[#D1E8DC]'
                          : 'bg-[#F7E9DC]/85 text-[#171615] border-[#A63816]/60 hover:bg-[#F0DAC5]'
                      }`}
                    >
                      {seg.text}
                    </button>
                  );
                }

                // 2. Unannotated text tokenized into interactive words without any layout-affecting styles or highlights
                if (!seg.wordPieces || seg.wordPieces.length === 0) {
                  return <React.Fragment key={sIdx}>{seg.text}</React.Fragment>;
                }

                return (
                  <React.Fragment key={sIdx}>
                    {seg.wordPieces.map((piece, wIdx) => {
                      if (!piece.core || !piece.normalized) {
                        return <React.Fragment key={wIdx}>{piece.raw}</React.Fragment>;
                      }

                      return (
                        <React.Fragment key={wIdx}>
                          {piece.leading}
                          <span
                            data-word-lookup="true"
                            data-word-index={`${pIdx}-${sIdx}-${wIdx}`}
                            onPointerEnter={(e) =>
                              handlePointerEnterPlainWord(
                                e,
                                piece.core,
                                fullParagraphText,
                                piece.charOffset
                              )
                            }
                            onPointerLeave={handlePointerLeaveAnyWord}
                            onClick={(e) =>
                              handleClickPlainWord(
                                e,
                                piece.core,
                                fullParagraphText,
                                piece.charOffset
                              )
                            }
                            onDoubleClick={(e) =>
                              handleDoubleClickWord(e, () =>
                                resolveWordAnnotation(
                                  piece.core,
                                  fullParagraphText,
                                  piece.charOffset
                                )
                              )
                            }
                            className="cursor-pointer"
                          >
                            {piece.core}
                          </span>
                          {piece.trailing}
                        </React.Fragment>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </p>
          );
        })}
      </div>

      {/* Interactive Vocabulary Strip Footer */}
      <div className="mt-8 rounded-xl border border-[#E3D7C3] bg-[#F2EDE3]/70 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#76675B]">
            Key Passage Vocabulary ({vocabulary.length} Highlighted Terms · Every Passage Word Interactive)
          </div>
          <div className="text-xs text-[#76675B]">
            Hover (briefly), double-click, or tap any word in the passage to view its English definition
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {vocabulary.map((v) => {
            const isSelected = activeVocab?.id === v.id;
            const isSaved = isVocabSaved(v);
            return (
              <button
                key={v.id}
                type="button"
                data-vocab-trigger="true"
                data-vocab-state={isSelected ? 'selected' : isSaved ? 'saved' : 'default'}
                aria-expanded={isSelected}
                aria-haspopup="dialog"
                onPointerEnter={(e) => handlePointerEnterCuratedWord(e, v)}
                onPointerLeave={handlePointerLeaveAnyWord}
                onFocus={(e) => handleFocusCuratedWord(e, v)}
                onBlur={handleBlurWord}
                onClick={(e) => handleClickCuratedWord(e, v)}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                  isSelected
                    ? 'border-[#A63816] bg-[#A63816] text-white'
                    : isSaved
                    ? 'border-[#287A52]/40 bg-[#E6F2EC]/70 text-[#1E5C3D] hover:bg-[#D1E8DC]'
                    : 'border-[#E3D7C3] bg-[#FAF7F1] text-[#171615] hover:border-[#A63816]'
                }`}
              >
                <span>{v.word}</span>
                <span className="text-[10px] opacity-70">({v.partOfSpeech})</span>
                {isSaved && <Check className="h-3 w-3 text-[#287A52]" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
