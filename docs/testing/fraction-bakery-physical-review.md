# Fraction Bakery: Physical Learner Review

**Purpose:** A small formative playtest to discover whether learners understand and can use Fraction Bakery, what causes confusion, and what should change before the game is accepted.

**Status:** Protocol ready. A human facilitator must run the sessions and record observations. Passing automated browser tests is not physical acceptance.

## 1. Principles and safeguards

- Participation is voluntary. Explain the activity in age-appropriate language and let the learner stop or skip any task without penalty.
- Obtain the permissions required by the school or institution and informed permission from a parent/guardian where applicable. Ask for the learner's own assent as well. Follow the institution's safeguarding rules.
- Do not run a session if the required permission or assent is missing.
- Do not collect names, student IDs, contact details, diagnoses, grades, photos, audio, or video for this formative review. Use a session code such as `FB-01` only.
- Do not enable optional research collection for the purpose of this playtest. Keep the session observational and separate from account/login requirements.
- Offer the learner their usual accessibility supports and input method. Record the support used only when it matters to interpret the interaction; do not ask for a diagnosis.
- Do not coach the learner toward the right answer during an observed task. If they ask for help, respond neutrally, note the request, and offer a hint only after recording the independent attempt.
- Stop or take a break if the learner shows distress, fatigue, or asks to stop. Do not treat errors as a learner failure.
- Store anonymous notes securely, share only with the project team, and delete them when the review is complete under the institution's rules.

This is a usability check, not a clinical assessment, formal educational study, or evidence that the game improves learning.

## 2. Recommended pilot

Start with **3–5 volunteer learners** as a small formative pilot, with an educator or facilitator who knows the learners' needs. This is enough to surface obvious usability problems, not enough to make statistical or general claims.

- **Time:** about 15–20 minutes per learner, including breaks.
- **Setting:** a quiet, familiar place with the actual device and input method intended for use.
- **Materials:** Fraction Bakery build, this protocol, anonymous observation sheet, and paper/pencil only if the learner normally uses them.
- **Tasks:** choose 4–6 short tasks spanning different types. Do not ask one learner to complete all 100 levels.
- **Facilitator role:** explain the activity, read prompts exactly as written when needed, observe without taking over, and record what happens.

Before the first learner, the facilitator should complete the session themselves on the same device and confirm the game starts, the selected levels can be reached, and the restart/back controls work.

## 3. Session script

Read or paraphrase this in a calm, age-appropriate way:

> We are trying out a maths game. We are testing the game, not testing you. Some parts may be confusing, and that helps us improve it. You can ask to stop, take a break, or skip anything. I may watch how the game works, but I will not record your name or take a photo or video. Is it okay for you to try it?

Confirm assent before starting. If the learner does not agree, thank them and stop.

Then say:

> Please try the game in the way that makes sense to you. I may wait quietly while you think. If something is confusing, you can tell me.

During the session, use neutral prompts only:
- “What do you think this screen is asking you to do?”
- “What would you try next?”
- “What part, if any, is confusing?”
- “Would you like to keep going, take a break, or stop?”

Avoid prompts that reveal the answer, such as telling the learner which pieces to count or which fraction to choose.

## 4. Task selection

Use the current 100-level game. Choose 4–6 tasks that the learner can reasonably attempt, starting with an introductory level and then sampling different mechanics. If the learner struggles, reduce the task count rather than rushing.

| Task type | What to observe | Evidence to record |
|---|---|---|
| Count shaded pieces / identify a fraction | Can the learner infer numerator and denominator from the dish without a numeric giveaway? | Correct interpretation, counting strategy, rereads, help requested |
| Compare two fractions | Does the learner understand what is being compared? | First action, explanation in their own words if offered, choice and confidence |
| Equivalent fractions | Does the learner recognize equal quantities with different partitions? | Whether the dish model helps, causes confusion, or is ignored |
| Simplify a fraction | Does the learner understand that the quantity stays the same while the representation changes? | Independent attempt, explanation, misleading wording or feedback |
| Order three fractions | Can the learner distinguish all three and understand the requested order? | Ties/ambiguity noticed, drag/tap behaviour, answer interpretation |
| Missing-count puzzle | Does the learner understand what is already counted and what remains? | Whether the prompt and answer choices make sense, arithmetic path |

Do not force every task type into every session. If a task is outside the learner's current learning goals, skip it and note why without attaching a negative label to the learner.

## 5. Observation sheet

Copy one sheet per session. Do not write identifying information.

### Session details
- Session code: `FB-__`
- Date (optional, use only if needed for version tracking):
- Game build / commit:
- Device and viewport:
- Input: touch / mouse / keyboard / assistive input / other:
- Relevant access settings used (optional):
- Facilitator code:
- Permission and assent confirmed: yes / no. If no, do not proceed.

### Per-task notes

| Task / level | Started independently? | Completed independently? | Time or pauses (rough) | Help requested? | Confusion / observed behaviour | Severity |
|---|---|---|---|---|---|---|
| | | | | | | |
| | | | | | | |
| | | | | | | |
| | | | | | | |
| | | | | | | |
| | | | | | | |

Use severity labels:
- **Blocker:** task cannot reasonably be attempted/completed, wrong answer is marked correct, correct answer is impossible, or the game becomes unusable.
- **Major:** the instruction or visual leads to a repeated misunderstanding, or a control prevents task completion.
- **Minor:** brief hesitation, unclear wording, small visual issue, or a recoverable control slip.
- **Suggestion:** preference or improvement idea that does not currently block use.

Describe what you observed, not what you assume the learner was thinking. Example: “Counted the shaded wedges twice and asked what ‘simplest form’ means” is more useful than “doesn't understand fractions.”

### End-of-session questions

Ask only if the learner is comfortable answering:
1. Which part felt easiest?
2. Which part was confusing or annoying?
3. Was there anything you wanted to tap or press but could not?
4. Would you want to try another level?

Record the learner's words only if necessary, anonymously and briefly. Do not pressure them to answer.

## 6. Acceptance gates

Fraction Bakery remains **under review** until the findings are examined. For this small pilot, use the following practical gates; they are project decisions, not validated research thresholds.

### Must pass before acceptance
- No blocker remains open.
- Correct answers and distractors behave as intended in the tasks observed.
- Learners can identify the requested action from the instruction or artwork without the facilitator revealing the answer.
- No horizontal overflow, clipped essential controls, or unreachable actions on the devices used.
- Touch, pointer, keyboard, or assistive input used by participants works for the observed tasks.
- Wrong answers and retries do not shame, punish, or trap the learner.
- No privacy or consent issue occurred.

### Usability signals to review
- Can learners begin a task with little or no explanation?
- Are equivalent-fraction and simplification tasks understood as different operations?
- Do learners understand the missing-count wording?
- Are visual dishes legible at the actual device size?
- Are text, contrast, tap targets, and feedback comfortable for the learner?
- Does the session length suit the learner, or are breaks / shorter sessions needed?

Do not treat a small pilot as a pass percentage proving the game works for all children. One serious accessibility or correctness issue can be more important than several successful sessions.

## 7. After each session

1. Thank the learner without judging their score.
2. Save only anonymous notes.
3. Record each issue with: task/level, observed behaviour, expected behaviour, severity, and a reproducible description.
4. Separate confirmed defects from suggestions and assumptions.
5. Do not change code in the middle of a session. Finish the session, then reproduce issues separately.
6. Group repeated observations into one issue, fix one focused batch, and rerun automated tests.
7. If changes affect a tested interaction, run a short follow-up with permission before marking the review complete.

## 8. Final review summary

Complete this after the pilot:

- Sessions completed:
- Task types tried:
- Blockers found / closed:
- Major issues found / closed:
- Minor issues / suggestions:
- Accessibility or device-specific findings:
- Code changes and regression tests:
- Follow-up session needed: yes / no
- Facilitator recommendation: accept for the next development step / revise and retest / pause
- Rationale:

**Acceptance rule:** The project owner and relevant educator review the anonymous findings and explicitly decide whether Fraction Bakery is accepted. Until that decision is recorded, Little Shop remains gated.

## 9. Limits

This protocol does not replace institutional safeguarding rules, formal ethics review when required, or specialist accessibility evaluation. If the activity is intended to produce generalizable research findings or collect research data, pause and follow the institution's research-governance process before collecting anything.
