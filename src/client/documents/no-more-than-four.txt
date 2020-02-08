## Challenge: no more than four!

Imagine a polyandrous society where a woman can have at most four husbands.

>In a parallel universe, Marge is married to Homer, Ned, and Troy McClure.


Complete the grammar rule set below to satisfy the conditions specified in the challenge.


```
rules:
    - name: "person"
      label: Person
      type: token
      pattern: |
        [entity=PERSON]+

    - name: "marriage-event"
      label: Marriage
      pattern: ???
```
