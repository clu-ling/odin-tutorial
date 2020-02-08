# Rule-based information extraction with Odin

This tutorial provides an introduction to Odin, a domain-independent rule-based system for information extraction.

# Why Odin?

- Supports patterns over directed graphs, such as syntactic dependency parses
  - Good generalizability
- Supports patterns over sequences of tokens and their attributes
- Supports rule templates and variables
- It was designed to be domain independent
- Rules can be scaffolded and applied in cascades
    - The output of one rule can be the input to another rule)
- Odin is [open source](https://github.com/clulab/processors), under active development, and it even has a [manual](https://arxiv.org/abs/1509.07513)
- You can use it natively from within the JVM (it was written in Scalal) or in [Python](https://github.com/myedibleenso/py-processors) using a [client-server architecture](https://github.com/myedibleenso/processors-server)
- Rules are written using `YAML` and familiar constructs

## Useful resources for learning Odin
- [The Odin manual](https://arxiv.org/abs/1509.07513)
- [*A Domain-independent Rule-based Framework for Event Extraction*](http://aclanthology.info/papers/a-domain-independent-rule-based-framework-for-event-extraction)
- [*Odin’s Runes: A Rule Language for Information Extraction*](http://www.lrec-conf.org/proceedings/lrec2016/pdf/32_Paper.pdf)


## Projects using Odin

- [Reach](https://github.com/clulab/reach/blob/master/README.md), a machine reading system for biomedical publications developed for [DARPA's Big Mechanism program](http://www.darpa.mil/program/big-mechanism)
- [The Bill and Melinda Gates Foundation's Healthy Birth, Growth, and Development Knowledge Initiative (HBGDKi)](http://www.nejm.org/doi/full/10.1056/NEJMp1605441#t=article)
- [A seedling project for DARPA's World Modelers program](https://researchportal.rutgers.edu/node/323)

## Prerequisites

This tutorial assumes that you have some familiarity with regular expresssions.

# Introduction

Odin operates over **documents** which have been tokenized, sentence-segmented, parsed, and annotated via an NLP pipeline for part-of-speech (PoS) tags, lemmas, and named entities.

**Rules** matched against these annotated documents produce **mentions** of entities, relations, or events that can then be reused to write more complicated rules (ex. entities $\rightarrow$ events $\rightarrow$ events involving other events).

These **rules** are written in a simple subset of `YAML` and can describe sequences of tokens or traversals over syntactic dependency parse. Luckily, you don't need to be an expert in `YAML` in order to write Odin rules.


All rules have the following fields:


|Field| Description|
|:---:|:------------|
|`name`|the name of the specific rule.  When a rule matches, the match (Mention) stores the value of this field in its `.foundBy` attribute.|
|`label`|What a rule's match represents (`Person`, `Location`, `Phosphorylation`, etc.).|
|`type`|Currently, two primary rule types `token` or `dependency`.  `token` refers to a surface pattern or sequence of tokens.  `dependency` refers to a pattern over a graph (syntactic dependency parse).|
|`pattern`| Specified as multi-line string using the vertical bar character (e.g. &#124; )|


## Notes on `YAML`
It's useful to keep in mind that `YAML` strings don’t have to be quoted. This is a nice feature that allows one to write
shorter and cleaner rules. However, there is one exception that you should be aware of: strings that
start with a YAML indicator character must be quoted. Indicator characters have special semantics
and must be quoted if they should be interpreted as part of a string. These are all the valid `YAML`
indicator characters:

```
- ? : , [ ] { } # & * ! | > ’ " % @ ‘
```
As you can probably tell, these are not characters that occur frequently in practice. Usually names
and labels are composed of alphanumeric characters and the occasional underscore, so, most of the
time, you can get away without quoting strings.


# Outcome

By the end of this tutorial, you will understand how to [interpret and modify this grammar](/examples/biology).

# Capturing entities

Before we can write rules to identify relations and events, we must first identify their participants.  We'll refer to these participants as **entities**.

## Capturing entities with surface patterns

A surface pattern is rule that is written in terms of a sequence of tokens.
The simplest surface pattern is just a sequence of words.  [For example, this rule will match the sequence *Special Agent* and tag it as being a `JobTitle`](/examples/cooper).

Of course as we'll see rules can get much more sophisticated than this.  For example, Odin allows you to write your pattern over combinations of *token attributes* (see the [token constraints](#Token-constraints) section for more details).

## Reusing mentions from an earlier rule

Much of the power of Odin comes from its ability to scaffold rules.  The output of one rule can be referenced by its **label** in subsequent rules.  This allows us to write compact, powerful grammars.  In a surface pattern, this is done using the syntax `@MyLabelHere` where `MyLabelHere` refers to whatever label you wish to reference.  We'll apply this syntax in the example below where we'll build another rule off of the output of `JobTitle`...


>FBI Special Agent Dale Cooper went missing on June 10, 1991

```yaml
- name: "job-title"
  label: JobTitle
  # This rule runs in the first pass
  # of Odin and never again
  priority: 1
  type: token
  pattern: |
    Special Agent

- name: "expanded-title"
  label: JobTitle
  priority: 2
  type: token
  pattern: |
    FBI @JobTitle
```


Note that we could omit the explicit priority from our second rule, "expanded-title", as it won't successfully match until an `@JobTitle` is available to reuse.  Limiting the priority here is an efficiency decision in that Odin won't event attempt to match the rule until told to do so.
## Test your understanding
- [**Challenge (easy)**: _another agent_](/challenges/another-agent)
- [**Challenge (medium)**: _chunking text_](/challenges/chunking-text)
- [**Challenge (medium++)**: _chunks -> PSG rules_](/challenges/simple-psg)

## Token contraints

| Field | Description |
|:-----:|:----------|
| `word` | The actual token. |
| `lemma` | The lemma form of the token |
| `tag` | The part-of-speech (PoS) tag assigned to the token |
| `incoming` | Incoming relations from the dependency graph for the token |
| `outgoing` | Outgoing relations from the dependency graph for the token |
| `chunk` | The shallow constituent type (ex. NP, VP) immediately containing the token |
| `entity` | The NER label of the token |
| `mention` | The label of any Mention(s) (i.e., rule output) that contains the token. |


For a more information on PoS tags (`tag` in the table above), see https://www.eecis.udel.edu/~vijay/cis889/ie/pos-set.pdf

## Disjunctions

Disjunctions are specified using `|`.  Imagine we want to find all adjectives and adverbs in the following snippet from W.H. Auden:

>the expensive delicate ship that must have seen
>something amazing, a boy falling out of the sky,
>had somewhere to get to and sailed calmly on.

```yaml
- name: "disjunction"
  label: Example
  type: token
  pattern: |
    [tag=RB] | [tag=JJ]
```


```yaml
- name: "disjunction"
  label: Example
  type: token
  pattern: |
    # if it's easier to read
    # we can split the disjunction
    # onto two lines
    [tag=RB] |
    [tag=JJ]
```

## Exact or regex

Patterns may involve an exact string or use regular expressions ([Java-flavored](https://docs.oracle.com/javase/tutorial/essential/regex/)).  [Let's look at an example.](/examples/exact-or-regex)


## Case-insensitive patterns

Pattens can be made case insensitive by beginning a regex with `/(?i)/`.  [Here's an example.](/examples/case-insensitive)

## Combining token constraints

Token constraints can be combined using `&`.  [Take a look at an example.](/examples/combined-constraints)


## Test your understanding
- [**Challenge (easy)**: _identifying words containing a certain morpheme_](/challenges/er-suffix)


## Negating token constraints

Token constraints can be negated by prefacing the attribute name with `!` (see example below):

`[!fieldname=pattern]`

## Test your understanding
- [**Challenge (easy)**: _no verbs!_](/challenges/no-verbs)

## Wildcard

Sometimes any token will suffice to complete a pattern.  In such cases where token constraints are unnecessary, the `[]` wildcard can be used.

Example pattern: `[] people`
  - Example matches
      - I see **dead people**
      - All the **lonely people**
      - The are a **strange people**



## Quantifiers

Token constraints, [arguments](#Quantifiers-for-dependency-patterns), and [graph edges](#Quantifiers-in-graph-traversals) can all be quantified.


| Symbol    | Description | Lazy form |
| ------------- |:-------------:| -----:|
|      `?` | The quantified pattern is optional. | `??` |
|      `*` | Repeat the quantified pattern zero or more times. | `*?` |
|      `+` | Repeat the quantified pattern one or more times. | `+?` |
|      `{n}` | Exact repetition. Repeat the quantified pattern n times. | |
|      `{n,m}` | Ranged repetition. Repeat the quantified pattern between *n* and *m* times, where *n* < *m*. | `{n,m}?` |
|      `{,m}` | Open start ranged repetition. Repeat the quantified pattern between 0 and m times, where *m* > 0. | `{,m}?` |
| `{n,}` | Open end ranged repetition. Repeat the quantified pattern at least *n* times, where *n* > 0. | `{n,}?` |



## Lookarounds and other zero-width assertions

Odin supports lookaround assertions, as well as start/end sentence anchors.  You can use lookarounds to specify contextual constraints that you don't want to end up in your result (ex. "only match B if it's preceded by A").

| Symbol        | Description   | Example Pattern | Match (in bold) |
| ------------- |:-------------:| -----:|:-------------:|
| `^`     | beginning of sentence | `^ My` | **My** name is Inigo Montoya . |
| `$`      | end of sentence      | `"." $` | My name is Inigo Montoya **.** |
| `(?=...)`      | postive lookahead      | `Inigo (?= Montoya)` | My name is **Inigo** Montoya . |
| `(?!...)`      | negative lookahead      | `Inigo (?! Arocena)` | My name is **Inigo** Montoya . |
| `(?<=...)`      | positive lookbehind     | `(?<= Inigo) Montoya` | My name is Inigo **Montoya** . |
| `(?<!...)`      | negative lookbehind     | `(?<! Carlos) Montoya` | My name is Inigo **Montoya** . |

# Refining rules: an example

Rule writing can be an incremental process or refinement.  Sometimes it's a matter of adding conjunctions to further constrain a match, or disjunctions to relax it.  Other times, as demonstrated below, it comes down to picking the appropriate representation/attribute for a token...

The naive rule below is trying label Person mentions as any sequence of proper nouns.  As you can see, this is too general.  You can probably think of other spurious stuff that this would match, right?


```yaml
- name: "person"
  label: Person
  priority: 1
  type: token
  pattern: |
    [tag=NNP]+
```

Let's see if we can do better.  It turns out we're lucky, as the model used by the named entity recognizer (NER) built into to our NLP pipeline has been trained to detect that label.  Let's take a look...


```yaml
- name: "person"
  label: Person
  priority: 1
  type: token
  pattern: |
    [entity=/PER$/]+
```

# Capturing events and relations

TODO

## Capturing events and relations with surface patterns

See [the relevant section](https://arxiv.org/pdf/1509.07513.pdf#page=10) in the manual

## Capturing events and relations with dependency patterns

See [the relevant section](https://arxiv.org/pdf/1509.07513.pdf#page=13) in the manual

For a description of dependency relations used by default in Odin, see the collapsed dependency described in https://nlp.stanford.edu/software/dependencies_manual.pdf


```yaml
- name: "person"
  label: Person
  type: token
  pattern: |
    [entity=/PER$/]+

- name: "marriage-event"
  label: Marriage
  pattern: |
    trigger = [lemma=marry]
    spouse: Person = nsubjpass
```

We end up with two `Marriage` event mentions, each containing only one spouse.  Wouldn't it be great if we had a way to specify how many of each argument were required for a single mention?

## Quantifiers for dependency patterns

We know it takes two to tango, so let's try to get those arguments in the same mention.

>Julia-Louis Dreyfus and Brad Hall were married in June of 1987.

```yaml
- name: "person"
  label: Person
  type: token
  pattern: |
    [entity=/PER$/]+

- name: "marriage-event"
  label: Marriage
  pattern: |
    trigger = [lemma=marry]
    spouse: Person+ = nsubjpass
```

We can even specify an exact number for each argument.


```yaml
- name: "person"
  label: Person
  type: token
  pattern: |
    [entity=/PER$/]+

- name: "marriage-event"
  label: Marriage
  pattern: |
    trigger = [lemma=marry]
    spouse: Person{2} = nsubjpass
```

## Challenge: no more than four!

Imagine a polyandrous society where a woman can have at most four husbands.

>In a parallel universe, Marge is married to Homer, Ned, and Troy McClure.


Complete the grammar rule set below to satisfy the conditions specified in the challenge.


```yaml
- name: "person"
  label: Person
  type: token
  pattern: |
    [entity=/PER$/]+

- name: "marriage-event"
  label: Marriage
  pattern: ???
```

## Challenge: optional arguments

Modify the grammar below to include two optional arguments in the `Marriage` event: "date" of type `Date` and "location" of type `Location`.  Remember that you'll need additional to capture `Date` and `Location` in order for them to be available to the event rule.


>Gonzo and Camilla were married in October.  Barack and Michelle were married in Chicago.

```yaml
- name: "person"
  label: Person
  type: token
  pattern: |
    [entity=/PER$/]+

# TODO: add a rule for Date

# TODO: add a rule for Location

# TODO: add optional args to "marriage-event"
- name: "marriage-event"
  label: Marriage
  pattern: |
    trigger = [lemma=marry]
    spouse: Person{2} = nsubjpass
```

## Quantifiers in graph traversals

See [the relevant section](https://arxiv.org/pdf/1509.07513.pdf#page=17) in the manual

# Variables and rule templates

It can be tedious to write sets of rules by hands.  Often you'll see that components of rules can or should be reused in subsets of your grammar. Odin supports the use of variables and templates to address just this.   Variables and templates help to maintain large grammars and create rule sets that can be "recycled" or applied to related problems with a few tweaks.

For more details, see [the relevant section](https://arxiv.org/pdf/1509.07513.pdf#page=20) in the manual

Templates work via file imports.  For more complex cases of template using involving multiple files, see the [odin examples](https://github.com/clulab/odin-examples) sbt project or [Reach](https://github.com/clulab/reach/blob/ccf0ee87c559e7d404b9cad277cea2536689ee8d/main/src/main/resources/org/clulab/reach/biogrammar/events_master.yml).

# Defining a taxonomy

See [the relevant section](https://arxiv.org/pdf/1509.07513.pdf#page=19) in the manual

# Priorities for rules

Rules are applied iteratively (pass 1, pass 2, .., pass *n*). If you want to control when a rule should be applied, specify a value for the rule field `priority`.  The value can be an open or closed range, exact value, or list of comma separated values.  By default, a rule will continue to be executed until no rule has produced a new match (`priority: 1+`).  This default means that you usually don't need to worry about setting the priority, but the power is there if you need it.

Note that [quantifiers](#Quantifiers) can be applied to priorities.

# Debugging rules

## Making sense of errors

Here we describe some common errors you may encounter as you learn to write rules.

### *A mispelled or missing `label` field...*

Every rule must have either a `label` or `labels` field.

This field tells Odin what the type of the Mention is that you're trying to capture.

Remember that these types can be "reused" in subsequent rules (ex. find a `Person` and then find events involving some `Person`).


```yaml
- name: "person"
  type: token
  pattern: |
    [entity=/PER$/]+
```

### *A mispelled or missing `name` field...*

Every rule needs a **name**.  B shur 2 spel it write two!


```yaml
# we've mispelled "name"
- nme: "person"
  label: Person
  type: token
  pattern: |
    [entity=/PER$/]+
```

### *An invalid rule `type`*...

By default, rules are assumed to be of type `dependency`.  If you're writing a *dependency* pattern, you can actually leave out the `type` field.  Wow, talk about convenient!

If you're writing a `token` pattern, however, you'll need to specify `type: token`.


```yaml
- name: "person"
  label: Person
  # we've mispelled "token"
  type: tken
  pattern: |
    [entity=/PER$/]+
```

### *An invalid token `field`...*

In the current version of Odin, you are restricted to a predefined set of token fields for use in your patterns.

See the [token constraints table](#Token-contraints) for a comprehensive list of valid token fields.


```yaml
- name: "person"
  label: Person
  type: token
  pattern: |
    [nonexistentfield=BLARG]+
```

### ***Avoid single line patterns...***


```yaml
- name: "person"
  label: Person
  priority: 1+
  type: token
  pattern: [entity=/PER$/]+
```

While the error message is cryptic, the solution is to simply make the pattern multiline (ex. `pattern: |`).

#### Great, but what's really happening here?
This pattern never makes it Odin, because it fails to parse as valid `YAML`.  `|` denotes a `YAML` [scalar](https://en.wikipedia.org/wiki/Variable_%28computer_science%29), which `YAML` will read without complaint and pass along to Odin.

Without the `|`, the `YAML` parser assumes that it's dealing with a list until it sees the `+`, which blows its mind with a wave of Cthulu madness, upends its conception of the reality, and sends it to an ashram for a period of convalescence and deep introspection.

### *Every rule must have a unique name...*

We keep track of what rule found each Mention, so rule names need to be unique to avoid ambiguities of provenance.


```yaml
- name: "person"
  label: Person
  type: token
  pattern: |
    [entity=/PER$/]+

- name: "person"
  label: Person
  type: token
  pattern: |
    [tag=NNP]+
```
