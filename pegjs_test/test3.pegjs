start   = code:(CallExpression / MemberExpression) _
    {
       return code;
   }

MemberExpression
    = head:(Words / CallExpression)
      tail:(
          _ "." _ a:(CallExpression / Words) {return "." + a}
        / _ "[" _ number:(Number+) "]" {return "[" + number + "]"}
          )*
         {return head + tail.join("")}

CallExpression
    = code:(Words "(" arglist:ArgList ")")
   {
       return code.join("");
   }


ArgList
  = _ b:CallExpression _ "," a:ArgList {return b + "," + a}
  / _ "," a:ArgList {return "_," + a}
  / b:CallExpression {return b}
  / "" {return "_"}

_ "whitespace"
  = [ \t\n\r]*

Words = code:$(Word (Word / Number)*) {return code;}
Word = [a-z]
Number = [0-9]
