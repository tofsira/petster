import assert from "node:assert/strict";
import test from "node:test";
import {
  estimateReadingTimeMinutes,
  extractLexicalText,
  isValidSlug,
  slugifyTitle,
} from "./editorial";

test("slugifyTitle keeps Thai and Latin words, lowercases, and removes spacing", () => {
  assert.equal(slugifyTitle(" แมว ไม่ กิน อาหาร 101! "), "แมว-ไม่-กิน-อาหาร-101");
  assert.equal(slugifyTitle("Dog Food Basics"), "dog-food-basics");
});

test("isValidSlug rejects spaces and punctuation", () => {
  assert.equal(isValidSlug("dog-food-basics"), true);
  assert.equal(isValidSlug("แมว-ไม่กินอาหาร"), true);
  assert.equal(isValidSlug("dog food"), false);
  assert.equal(isValidSlug("dog/food"), false);
});

test("extractLexicalText reads nested rich text nodes", () => {
  const state = {
    root: {
      children: [
        {
          children: [
            { text: "หนึ่ง", type: "text" },
            { text: "สอง", type: "text" },
          ],
          type: "paragraph",
        },
      ],
    },
  };

  assert.equal(extractLexicalText(state), "หนึ่ง สอง");
});

test("estimateReadingTimeMinutes never returns less than one minute", () => {
  assert.equal(estimateReadingTimeMinutes("สั้นมาก"), 1);
});
