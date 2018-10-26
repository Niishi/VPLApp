start = Expr+
Expr = expr:(Block / Identifier) _ {return expr;}
Block = "{" child:(_ expr:Expr _{return expr})* "}" {return child;}

Identifier = $([a-z]+)

_ = (Whitespace / LineTerminator)*
Whitespace = [\t\v\f \u00A0\uFEFF]
LineTerminator = [\n\r\u2028\u2029]
