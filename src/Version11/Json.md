# SLR for Json

```txt
<Start>-><JSON>'EOF':return $0
<JSON>->'int':return $0.Value
<JSON>-><Array>:return $0
<Array>->'['']':return []
<Array>->'['<JSON><Array'>:return Array.prototype.concat([$0],$1)
<Array'>->']':return []
<JSON>->'String':return $0.Value
<JSON>-><Object>:return $0
<Object>->'{''}':return {}
<Object>->'{'<ObjectItem><Object'>:$1[$0.Key]=$0.Value;return $1
<ObjectItem>->'String'':'<JSON>:return {Key:$0.Value,Value:$1}
<Object'>->'}':return {}
<Object'>->','<ObjectItem><Object'>:$1[$0.Key]=$0.Value;return $1
```

```json
[
    {
      "State": "Start",
      "Delta": [
        "JSON",
        "EOF"
      ],
      "Action": "return $0"
    },
    {
      "State": "JSON",
      "Delta": [
        "int"
      ],
      "Action": "return $0.Value"
    },
    {
      "State": "JSON",
      "Delta": [
        "Array"
      ],
      "Action": "return $0"
    },
    {
      "State": "Array",
      "Delta": [
        "[",
        "]"
      ],
      "Action": "return []"
    },
    {
      "State": "Array",
      "Delta": [
        "[",
        "JSON",
        "Array'"
      ],
      "Action": "return Array.prototype.concat([$0],$1)"
    },
    {
      "State": "Array'",
      "Delta": [
        "]"
      ],
      "Action": "return []"
    },
    {
      "State": "JSON",
      "Delta": [
        "String"
      ],
      "Action": "return $0.Value"
    },
    {
      "State": "JSON",
      "Delta": [
        "Object"
      ],
      "Action": "return $0"
    },
    {
      "State": "Object",
      "Delta": [
        "{",
        "}"
      ],
      "Action": "return {}"
    },
    {
      "State": "Object",
      "Delta": [
        "{",
        "ObjectItem",
        "Object'"
      ],
      "Action": "$1[$0.Key]=$0.Value;return $1"
    },
    {
      "State": "ObjectItem",
      "Delta": [
        "String",
        ":",
        "JSON"
      ],
      "Action": "return {Key:$0.Value,Value:$1}"
    },
    {
      "State": "Object'",
      "Delta": [
        "}"
      ],
      "Action": "return {}"
    },
    {
      "State": "Object'",
      "Delta": [
        ",",
        "ObjectItem",
        "Object'"
      ],
      "Action": "$1[$0.Key]=$0.Value;return $1"
    }
  ]
```