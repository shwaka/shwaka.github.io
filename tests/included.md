## markdown test
`code`

[Jekyll](http://jekyllrb-ja.github.io/)

```kotlin
fun hoge(a: Int, b: Int): Int {
    return a + b
}
```

## variable test

{% if page.lang == "en" %}
  lang is en
{% elsif page.lang == "ja" %}
  lang is ja
{% else %}
  lang is {{ page.lang }}
{% endif %}
