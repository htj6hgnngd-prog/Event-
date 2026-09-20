# VECTA HEADLINE SYSTEM

Version 1.0

VECTA uses three headline levels.

## MANIFESTO

Attribute: data-headline="manifesto"

Rules:
- exactly one per page;
- names the category or commercial thesis;
- up to three visual lines;
- no vague metaphor without category context.

Current role:
"ПРОЕКТИРУЕМ МЕДИА-РЕЗУЛЬТАТ СОБЫТИЯ."

## SECTION

Attribute: data-headline="section"

Rules:
- one clear tension or outcome;
- normally two or three visual lines;
- supports page storytelling;
- does not repeat the section label.

Examples:
- "СОБЫТИЕ ЗАКАНЧИВАЕТСЯ. КОНТЕНТ РАБОТАЕТ ДАЛЬШЕ."
- "КРАСИВО СНЯТЬ НЕДОСТАТОЧНО."

## OPERATIONAL

Attribute: data-headline="operational"

Rules:
- names a concrete mode, step, output or action;
- short;
- may use stable production terminology;
- no brand poetry.

Examples:
- "OUTPUT LENS"
- "ЗАДАЧА -> КАНАЛЫ -> OUTPUTS"
- "ОТДЕЛЬНАЯ СЪЁМОЧНАЯ ЕДИНИЦА."

## Enforcement

scripts/copy-lint.js checks:
- one manifesto;
- minimum section and operational headline coverage;
- banned clichés;
- no long dash;
- maximum manifesto length.
