## Challenge: optional arguments

Modify the grammar below to include two optional arguments in the `Marriage` event: "date" of type `Date` and "location" of type `Location`.  Remember that you'll need additional to capture `Date` and `Location` in order for them to be available to the event rule.

>Gonzo and Camilla were married in October.  Barack and Michelle were married in Chicago.



```
rules:
    - name: "person"
      label: Person
      type: token
      pattern: |
        [entity=PERSON]+

    # TODO: add a rule for Date

    # TODO: add a rule for Location

    # TODO: add optional args to "marriage-event"
    - name: "marriage-event"
      label: Marriage
      pattern: |
        trigger = [lemma=marry]
        spouse: Person{2} = nsubjpass
```
