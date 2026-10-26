export interface DiffPart {
  value: string;
  added?: boolean;
  removed?: boolean;
}

/**
 * Computes word-level diff between oldText and newText using Longest Common Subsequence (LCS).
 * Preserves spaces and line breaks so formatted rendering looks pristine.
 */
export function computeWordDiff(oldText: string, newText: string): DiffPart[] {
  if (oldText === newText) {
    return [{ value: oldText }];
  }

  // Tokenize into words and whitespace/newlines
  const tokenize = (text: string): string[] => {
    // Splits by spaces, punctuation, or line breaks while preserving delimiters
    return text.match(/([^\s\n\r]+|[\n\r]+|[ \t]+)/g) || [];
  };

  const oldTokens = tokenize(oldText);
  const newTokens = tokenize(newText);

  const n = oldTokens.length;
  const m = newTokens.length;

  // For very long texts, guard memory with an optimized table or cap
  if (n * m > 1000000) {
    // Fallback for massive docs: chunk comparison
    return [
      { value: oldText, removed: true },
      { value: newText, added: true }
    ];
  }

  // DP table for LCS
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (oldTokens[i - 1] === newTokens[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to assemble diff parts
  const rawParts: DiffPart[] = [];
  let i = n;
  let j = m;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldTokens[i - 1] === newTokens[j - 1]) {
      rawParts.push({ value: oldTokens[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      rawParts.push({ value: newTokens[j - 1], added: true });
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      rawParts.push({ value: oldTokens[i - 1], removed: true });
      i--;
    }
  }

  rawParts.reverse();

  // Merge contiguous segments with the same diff status
  const merged: DiffPart[] = [];
  for (const part of rawParts) {
    const last = merged[merged.length - 1];
    if (
      last &&
      Boolean(last.added) === Boolean(part.added) &&
      Boolean(last.removed) === Boolean(part.removed)
    ) {
      last.value += part.value;
    } else {
      merged.push({ ...part });
    }
  }

  return merged;
}

export function computeDiffStats(oldText: string, newText: string) {
  const parts = computeWordDiff(oldText, newText);
  let addedCount = 0;
  let removedCount = 0;
  
  for (const part of parts) {
    const wordCount = (part.value.match(/\S+/g) || []).length;
    if (part.added) addedCount += wordCount;
    if (part.removed) removedCount += wordCount;
  }

  const charDelta = newText.length - oldText.length;
  const isIdentical = oldText.trim() === newText.trim();

  return {
    parts,
    addedWords: addedCount,
    removedWords: removedCount,
    charDelta,
    isIdentical,
    summary: isIdentical 
      ? 'Zero editorial changes (Human approved 100% unaltered AI draft)'
      : `Modified: +${addedCount} words added, -${removedCount} words removed (${charDelta >= 0 ? '+' : ''}${charDelta} chars)`
  };
}
