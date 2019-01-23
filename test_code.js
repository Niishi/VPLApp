//ArrayExpression
[1,2,3];
[,2,3];
[1,,3];
[1,2,];
[,,3];
[,,];

/* ObjectExpression */

/* FunctionExpression */

/* ArrowFunction未実装 */

/*TaggedTemplateExpression未実装 */

/* MemberExpression */
a[1];
a[];
a.x;
a.;
.x;
.;
..;
//[1];

/* Super未実装 */

/* MetaProperty未実装*/

/* NewExpression / CallExpression */
new A();
new A(1,2,3);
new ();
new (1,2,3);
new (,,);
a();
a(1,2,3);
a(,,3);
a(,,);

/* UpdateExpression
    欠けた時にpostfixかprefixか分からなくなる */
++a;
++;
--a;
--;

/* UnaryExpression */
+a;
+;
-;
!;

/* BinaryExpression */
x + 1;
x +;
+ 1;
+;
x == 1;
== 1;
x == ;
==;

/* LogicalExpression */
a && b;
a &&;
&& b;
&&;

/* ConditionalExpression */
x ? 1 : 2;
  ? 1 : 2;
x ?   : 2;
x ? 1 :  ;
x ?   :  ;
  ?      ;

/* AssignmentExpression */
x = 1;
  = 1;
x =  ;
=;

/* SequenceExpression未実装 */

/* BlockStatement */
{
    x = 0;
    y = 1;
}

/* BreakStatement */
break a;
break;

/* ClassDeclaration */

/* ContinueStatement */
continue;
continue a;

/* DoWhileStatement */
do{

}while(false);
do{

}while();

/* EmptyStatement */
;

/* ExpressionStatement */
x = 0;
x = 0

/* ForStatement */
for(i = 0; i < 10; i++){

}
for(i = 0; i < 10; ){

}
for(i = 0; ;i++){

}
for( ; i<10; i++){

}
for(; ;){

}
for(var i = 0; i < 10; i++){

}
for(var i = 0; i < 10; ){

}
for(var i = 0; ;i++){

}

/* For-InStatement (pegに実装がないため割愛)*/
/* For-OfStatement (pegに実装がないため割愛)*/

/* FunctionDeclaration */
function f(){

}
function f(x,y){

}
function f(,y){

}
fucntion f(,){

}

/* IfStatement */
if(x){

}
if(){

}
if(x){

}else{

}
if(){

}else{

}
if(x){

}else if(x){

}else{

}
if(){

}else if(x){

}else {

}
if(){

}else if(){

}else {

}

/* LabelledStatement 未実装*/
/* ReturnStatement */
return;
return x;
