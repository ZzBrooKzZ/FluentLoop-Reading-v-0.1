import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Bookmark, Check, Volume2, X, Sparkles, BookOpen } from 'lucide-react';
import { VocabularyAnnotation } from '../types/reading';

interface InteractivePassageProps {
  lessonId: string;
  paragraphs: string[];
  vocabulary: VocabularyAnnotation[];
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  savedWordIds: Set<string>;
  onToggleSaveWord: (vocab: VocabularyAnnotation) => void;
  showArabicTranslation: boolean;
  highlightedEvidenceQuote?: string | null;
}

interface Segment {
  text: string;
  vocab?: VocabularyAnnotation;
  occurrenceIdx?: number;
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
 * Returns the primary client rect for an inline button even if a multi-word phrase wraps across lines.
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
const HOVER_CLOSE_DELAY_MS = 180;

export const InteractivePassage: React.FC<InteractivePassageProps> = ({
  lessonId,
  paragraphs,
  vocabulary,
  fontSize,
  savedWordIds,
  onToggleSaveWord,
  showArabicTranslation,
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
  const closeTimerRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const closePopup = useCallback(() => {
    clearCloseTimer();
    setActiveVocab(null);
    setAnchorEl(null);
    setPinnedByClick(false);
    anchorElRef.current = null;
    setPopupPos((prev) => (prev.ready ? { ...prev, ready: false } : prev));
  }, [clearCloseTimer]);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      setActiveVocab(null);
      setAnchorEl(null);
      setPinnedByClick(false);
      anchorElRef.current = null;
      setPopupPos((prev) => (prev.ready ? { ...prev, ready: false } : prev));
    }, HOVER_CLOSE_DELAY_MS);
  }, [clearCloseTimer]);

  // Reset popup when switching lessons
  useEffect(() => {
    closePopup();
  }, [lessonId, closePopup]);

  // Smoothly scroll highlighted evidence paragraph into view when student clicks "Locate in Passage"
  useEffect(() => {
    if (!highlightedEvidenceQuote) return;
    const highlightedEl = document.querySelector('[data-evidence-highlighted="true"]');
    if (highlightedEl instanceof HTMLElement) {
      highlightedEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [highlightedEvidenceQuote]);

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
  }, [activeVocab, anchorEl, showArabicTranslation, savedWordIds, updatePopupPosition]);

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

  // Tokenize all paragraphs together so occurrence counts across the whole passage remain accurate
  const renderedParagraphs = React.useMemo(() => {
    if (!vocabulary || vocabulary.length === 0) {
      return paragraphs.map((p) => [{ text: p } as Segment]);
    }

    const sortedVocab = [...vocabulary].sort((a, b) => {
      const aLen = (a.matchedText || a.word).length;
      const bLen = (b.matchedText || b.word).length;
      return bLen - aLen;
    });

    const patternParts = sortedVocab
      .flatMap((v) => [v.matchedText?.trim(), v.word.trim()])
      .filter((w): w is string => Boolean(w))
      .map((w) => escapeRegExp(w));

    if (patternParts.length === 0) {
      return paragraphs.map((p) => [{ text: p } as Segment]);
    }

    const regex = new RegExp(`\\b(${patternParts.join('|')})\\b`, 'gi');
    const occurrenceCounter: Record<string, number> = {};
    const matchedOnce = new Set<string>();

    return paragraphs.map((paragraph) => {
      const segments: Segment[] = [];
      let lastIndex = 0;
      let match: RegExpExecArray | null;

      regex.lastIndex = 0;
      while ((match = regex.exec(paragraph)) !== null) {
        const matchedText = match[0];
        const startIdx = match.index;

        if (startIdx > lastIndex) {
          segments.push({ text: paragraph.slice(lastIndex, startIdx) });
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
          });
        } else {
          segments.push({ text: matchedText });
        }

        lastIndex = startIdx + matchedText.length;
      }

      if (lastIndex < paragraph.length) {
        segments.push({ text: paragraph.slice(lastIndex) });
      }

      return segments;
    });
  }, [paragraphs, vocabulary]);

  const handlePointerEnterWord = (
    e: React.PointerEvent<HTMLButtonElement>,
    vocab: VocabularyAnnotation
  ) => {
    if (e.pointerType === 'touch') return;
    clearCloseTimer();
    if (pinnedByClick && activeVocab?.id !== vocab.id) {
      return;
    }
    const targetEl = e.currentTarget;
    anchorElRef.current = targetEl;
    setAnchorEl(targetEl);
    setActiveVocab(vocab);
  };

  const handlePointerLeaveWord = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType === 'touch') return;
    if (pinnedByClick) return;
    scheduleClose();
  };

  const handleFocusWord = (
    e: React.FocusEvent<HTMLButtonElement>,
    vocab: VocabularyAnnotation
  ) => {
    clearCloseTimer();
    if (pinnedByClick && activeVocab?.id !== vocab.id) return;
    const targetEl = e.currentTarget;
    anchorElRef.current = targetEl;
    setAnchorEl(targetEl);
    setActiveVocab(vocab);
  };

  const handleBlurWord = (e: React.FocusEvent<HTMLButtonElement>) => {
    if (pinnedByClick) return;
    const related = e.relatedTarget as Node | null;
    if (related && popoverRef.current?.contains(related)) {
      return;
    }
    scheduleClose();
  };

  const handleClickWord = (
    e: React.MouseEvent<HTMLButtonElement>,
    vocab: VocabularyAnnotation
  ) => {
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

  const floatingPopup =
    activeVocab && typeof document !== 'undefined'
      ? createPortal(
          <div
            ref={popoverRef}
            role="dialog"
            aria-label={`Contextual explanation for ${activeVocab.word}`}
            onPointerEnter={(e) => {
              if (e.pointerType !== 'touch') {
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
            }}
            className="w-[min(360px,calc(100vw-24px))] rounded-xl border border-[#D5C7B2] bg-[#FFFDF9] shadow-[0_14px_34px_-6px_rgba(20,20,19,0.18),0_4px_12px_-2px_rgba(20,20,19,0.08)]"
          >
            {/* Directional Caret Arrow */}
            <div
              aria-hidden="true"
              style={{ left: `${popupPos.arrowLeft - 6}px` }}
              className={`pointer-events-none absolute h-3 w-3 rotate-45 border-[#D5C7B2] bg-[#FFFDF9] ${
                popupPos.placement === 'top'
                  ? '-bottom-[6.5px] border-r border-b'
                  : '-top-[6.5px] border-t border-l'
              }`}
            />

            {/* Scrollable inner body for long definitions */}
            <div className="max-h-[min(380px,calc(100vh-32px))] overflow-y-auto p-4">
              {/* Header: Word, Audio, Part of Speech, Save & Close */}
              <div className="flex items-start justify-between gap-2 border-b border-[#EAE3D5] pb-2.5">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <h4 className="font-display text-lg font-bold leading-tight text-[#141413]">
                      {activeVocab.word}
                    </h4>
                    <button
                      type="button"
                      onClick={() => speakWord(activeVocab.word)}
                      title="Listen to pronunciation"
                      aria-label={`Listen to pronunciation of ${activeVocab.word}`}
                      className="inline-flex items-center justify-center rounded-md p-1 text-[#57534E] hover:bg-[#F3EFE6] hover:text-[#141413] transition-colors cursor-pointer"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                    </button>
                    {activeVocab.partOfSpeech && (
                      <span className="font-mono-code text-[11px] font-semibold uppercase tracking-wider text-[#9A3412]">
                        {activeVocab.partOfSpeech}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => onToggleSaveWord(activeVocab)}
                    className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors cursor-pointer ${
                      savedWordIds.has(activeVocab.id)
                        ? 'bg-[#15803D] text-white'
                        : 'bg-[#9A3412] text-white hover:bg-[#7C2D12]'
                    }`}
                  >
                    {savedWordIds.has(activeVocab.id) ? (
                      <>
                        <Check className="h-3 w-3" />
                        <span>Saved</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="h-3 w-3" />
                        <span>Save Word</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={closePopup}
                    aria-label="Close vocabulary popup"
                    className="rounded-md p-1 text-[#78716C] hover:bg-[#F3EFE6] hover:text-[#141413] cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Definitions Stack */}
              <div className="mt-2.5 space-y-2">
                <div className="rounded-lg border border-[#EAE3D5] bg-[#FAF7F2] p-2.5">
                  <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#57534E]">
                    <BookOpen className="h-3 w-3 text-[#9A3412]" />
                    <span>Simple English Definition</span>
                  </div>
                  <p className="mt-0.5 text-xs leading-relaxed text-[#141413]">
                    {activeVocab.simpleDefinition}
                  </p>
                </div>

                <div data-vocab-definition="context" className="rounded-lg border border-[#FDE68A] bg-[#FEF3C7]/45 p-2.5">
                  <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#9A3412]">
                    <Sparkles className="h-3 w-3 text-[#9A3412]" />
                    <span>Meaning in This Passage</span>
                  </div>
                  <p className="mt-0.5 text-xs leading-relaxed text-[#141413]">
                    {activeVocab.contextMeaning}
                  </p>
                </div>
              </div>

              {/* Example Sentence & Synonyms */}
              {activeVocab.exampleSentence && (
                <div className="mt-2.5 text-[11px] leading-relaxed text-[#57534E]">
                  <span className="font-semibold text-[#141413]">Example: </span>
                  <span className="italic">“{activeVocab.exampleSentence}”</span>
                </div>
              )}

              {activeVocab.synonyms && activeVocab.synonyms.length > 0 && (
                <div className="mt-1.5 text-[11px] text-[#57534E]">
                  <span className="font-semibold text-[#141413]">Synonyms: </span>
                  <span>{activeVocab.synonyms.join(' · ')}</span>
                </div>
              )}

              {/* Optional Arabic Support (Hidden by default) */}
              {showArabicTranslation && activeVocab.arabicTranslation && (
                <div className="mt-2 border-t border-[#EAE3D5] pt-2 flex items-center justify-between text-xs text-[#57534E]">
                  <span className="text-[10px] uppercase tracking-wider text-[#78716C]">
                    Optional Arabic Support
                  </span>
                  <span dir="rtl" className="font-semibold text-xs text-[#141413]">
                    {activeVocab.arabicTranslation}
                  </span>
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
      <div className={`font-serif-passage text-[#141413] space-y-6 ${fontSizeClasses[fontSize]}`}>
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
                  ? 'rounded-lg bg-[#DCFCE7]/50 px-3 py-2 border-l-4 border-[#15803D]'
                  : ''
              }`}
            >
              <span
                title={`Paragraph ${pIdx + 1} (${String.fromCharCode(65 + pIdx)})`}
                className="mr-2.5 select-none font-mono-code text-xs font-semibold text-[#A8A29E]"
              >
                [{pIdx + 1} · {String.fromCharCode(65 + pIdx)}]
              </span>
              {segments.map((seg, sIdx) => {
                if (!seg.vocab) {
                  return <React.Fragment key={sIdx}>{seg.text}</React.Fragment>;
                }

                const vocabItem = seg.vocab;
                const isSelected = activeVocab?.id === vocabItem.id;
                const isSaved = savedWordIds.has(vocabItem.id);

                return (
                  <button
                    key={`${vocabItem.id}-${sIdx}`}
                    type="button"
                    data-vocab-trigger="true"
                    data-vocab-state={isSelected ? 'selected' : isSaved ? 'saved' : 'default'}
                    aria-expanded={isSelected}
                    aria-haspopup="dialog"
                    onPointerEnter={(e) => handlePointerEnterWord(e, vocabItem)}
                    onPointerLeave={handlePointerLeaveWord}
                    onFocus={(e) => handleFocusWord(e, vocabItem)}
                    onBlur={handleBlurWord}
                    onClick={(e) => handleClickWord(e, vocabItem)}
                    className={`inline rounded px-1 py-0.5 font-medium transition-colors cursor-pointer border-b-2 ${
                      isSelected
                        ? 'bg-[#9A3412] text-white border-[#9A3412]'
                        : isSaved
                        ? 'bg-[#DCFCE7]/70 text-[#14532D] border-[#15803D] hover:bg-[#DCFCE7]'
                        : 'bg-[#FEF3C7]/65 text-[#141413] border-[#D97706]/70 hover:bg-[#FDE68A]'
                    }`}
                  >
                    {seg.text}
                  </button>
                );
              })}
            </p>
          );
        })}
      </div>

      {/* Interactive Vocabulary Strip Footer */}
      <div className="mt-8 rounded-xl border border-[#E5DEC9] bg-[#F3EFE6]/60 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#57534E]">
            Key Passage Vocabulary ({vocabulary.length} Contextual English Explanations)
          </div>
          <div className="text-xs text-[#78716C]">
            Hover or tap any word in the passage or below to open its floating explanation
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {vocabulary.map((v) => {
            const isSelected = activeVocab?.id === v.id;
            const isSaved = savedWordIds.has(v.id);
            return (
              <button
                key={v.id}
                type="button"
                data-vocab-trigger="true"
                data-vocab-state={isSelected ? 'selected' : isSaved ? 'saved' : 'default'}
                aria-expanded={isSelected}
                aria-haspopup="dialog"
                onPointerEnter={(e) => handlePointerEnterWord(e, v)}
                onPointerLeave={handlePointerLeaveWord}
                onFocus={(e) => handleFocusWord(e, v)}
                onBlur={handleBlurWord}
                onClick={(e) => handleClickWord(e, v)}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                  isSelected
                    ? 'border-[#9A3412] bg-[#9A3412] text-white'
                    : isSaved
                    ? 'border-[#15803D]/40 bg-[#DCFCE7]/60 text-[#14532D] hover:bg-[#DCFCE7]'
                    : 'border-[#D8CFC2] bg-[#FAF7F2] text-[#141413] hover:border-[#9A3412]'
                }`}
              >
                <span>{v.word}</span>
                <span className="text-[10px] opacity-70">({v.partOfSpeech})</span>
                {isSaved && <Check className="h-3 w-3 text-[#15803D]" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

