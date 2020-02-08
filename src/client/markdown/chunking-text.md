## Challenge: chunky stuff
Write a rule set that captures this simple phrase structure grammar for linguistic constituents:
```
Verb        ->  (identify by PoS tag of terminals)
Noun        ->  (identify by PoS tag of terminals)
Adjective   ->  (identify by PoS tag of terminals)
NP          ->  determiner (by tag) + zero or more Adjective + one or more Noun
```
