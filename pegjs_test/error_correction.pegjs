start   = code:(a:AssignmentExpression b:SEMI {return a+b;})* {return code.join("")}
	/ code:(c:AssignmentExpression b:(SEMI a:AssignmentExpression{return ";"+a;})* {return c+b.join("")})

MemberExpression
    = head:(CallExpression / Words / _ {return "_"})
      tail:(
          _ "." _ a:(CallExpression / Words / _ {return "_"}) {return "." + a}
        / _ "[" _ number:DecimalIntegerLiteral "]" {return "[" + number + "]"}
          )*
         {return head + tail.join("")}

CallExpression
    = code:(Words "(" arglist:ArgList RPAR)
   {
       return code.join("");
   }



ArgList
  = b:Expression "," a:ArgList {return b + "," + a}
  / _ "," a:ArgList {return "_," + a}
  / b:Expression {return b}
  / "" {return "_"}

AssignmentExpression
    = left:(MemberExpression / Words / _ ) _
      "=" _
      right:AssignmentExpression
      {
          return left + "=" + right;
      }
    / Expression

Expression = _ b:(MemberExpression / Words / DecimalIntegerLiteral) _ {return b;}

_ "whitespace"
  = [ \t\n\r]*

SEMI = _ ";" _ {return ";"}
RPAR = ")"? {return ")"}
Words = code:$(Word (Word / DecimalIntegerLiteral)*){return code;}
Word = [a-z]

DecimalIntegerLiteral
  = "0"
  / NonZeroDigit DecimalDigit*

DecimalDigit
  = [0-9]

NonZeroDigit
  = [1-9]
