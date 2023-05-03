%{
    import { LexicalErrorEx } from './exceptions/LexicalErrorEx';

    import { IStatement } from "./abstract/IStatement";
    import { IExpression } from "./abstract/IExpression";
    import { IParam } from "./abstract/IParam";

    import { Declaration } from "./statements/Declaration";
    import { Assign } from "./statements/Assign";
    import { If } from "./statements/If";
    import { Elif } from "./statements/Elif";
    import { Print } from "./statements/Print";
    import { Println } from "./statements/Println";
    import { While } from "./statements/While";
    import { BreakLoop } from "./statements/BreakLoop";
    import { ContinueLoop } from "./statements/ContinueLoop";
    import { DoWhile } from "./statements/DoWhile";
    import { DoUntil } from "./statements/DoUntil";
    import { Return } from "./statements/Return";
    import { FunctionDef } from "./statements/FunctionDef";
    import { Method } from "./statements/Method";
    import { For } from "./statements/For";
    import { Case } from "./statements/Case";
    import { Switch } from "./statements/Switch";
    import { DeclareArrayOne } from "./statements/DeclareArrayOne";
    import { DeclareArrayTwo } from "./statements/DeclareArrayTwo";
    import { Run } from "./statements/Run";


    import fnParseDatatype from "./functions/fnParseDatatype";
    import fnParseBoolean from "./functions/fnParseBoolean";

    import { Terminals } from "./enums/EnumTerminals";
    import { RelationalOp } from "./enums/EnumRelational";
    import { ArithmeticOp } from "./enums/EnumArithmetic";
    import { LogicalOp } from "./enums/EnumLogical";

    import { Terminal } from "./expressions/Terminal";
    import { Relational } from "./expressions/Relational";
    import { Arithmetic } from "./expressions/Arithmetic";
    import { Logical } from "./expressions/Logical";
    import { Negative } from "./expressions/Negative";
    import { Not } from "./expressions/Not";
    import { Ternary } from "./expressions/Ternary";
    import { Increment } from "./expressions/Increment";
    import { Decrement } from "./expressions/Decrement";
    import { Cast } from "./expressions/Cast";
    import { Call } from "./expressions/Call";
    import { AccessArray } from "./expressions/AccessArray";
    import { AccessMatrix } from "./expressions/AccessMatrix";
    import { ToLower } from "./expressions/ToLower";
    import { ToUpper } from "./expressions/ToUpper";
    import { Round } from "./expressions/Round";
    import { TypeOf } from "./expressions/TypeOf";
    import { ToString } from "./expressions/ToString";



    
%}

%lex
%options case-insensitive

%%
\s+ // ignore whitespaces
"//".* // ignore comments
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/] // ignore comments

// terminals
[0-9]+("."[0-9]+)\b return 'DECIMAL';
[0-9]+\b return 'INTEGER';
True|False return 'LOGICAL';
\"((\\\")|[\\n]|[\\\\]|[^\"])*\" {yytext=yytext.substr(1,yyleng-2); return 'STRING';}
\'((\\\')|[\\n]|[\\\\]|[^\'])?\' {yytext=yytext.substr(1,yyleng-2); return 'CHAR';}


// increment and decrement
'++' return 'INCREMENT';
'--' return 'DECREMENT';

// arithmetic operators
'+' return 'ADD';
'-' return 'MINUS';
'*' return 'PRODUCT';
'/' return 'DIVISION';
'%' return 'MODULE';
'^' return 'POWER';

// relational operators
'==' return 'EQUAL';
'!=' return 'NOT_EQUAL';
'<=' return 'LESS_EQUAL';
'>=' return 'GREATER_EQUAL';
'<' return 'LESS';
'>' return 'GREATER';

// ternary operators
'?' return 'TERNARY_IF';
':' return 'TERNARY_ELSE';

// logical operators
'&&' return 'AND';
'||' return 'OR';
'!' return 'NOT';

// grouping operators
'(' return 'OPEN_PARENTHESIS';
')' return 'CLOSE_PARENTHESIS';

// encapsulation operators
'{' return 'OPEN_BRACE';
'}' return 'CLOSE_BRACE';

// array operators
'[' return 'OPEN_BRACKET';
']' return 'CLOSE_BRACKET';

// end sentence operator
';' return 'END_SENTENCE';
//
'.' return 'PUNTO';
// comma
',' return 'COMMA';

// assignment
'=' return 'ASSIGNMENT';

// type
"Int" return 'TYPE';
"Double" return 'TYPE';
"Boolean" return 'TYPE';
"Char" return 'TYPE';
"String" return 'TYPE';

// reserved words
'new' return 'NEW';
'add' return 'ADDLIST'
'list' return 'LIST';
'if' return 'IF';
'else' return 'ELSE';
'elif' return 'ELIF';
'switch' return 'SWITCH';
'case' return 'CASE';
'break' return 'BREAK';
'default' return 'DEFAULT';
'continue' return 'CONTINUE';
'while' return 'WHILE';
'for' return 'FOR';
'do' return 'DO';
'until' return 'UNTIL';
'return' return 'RETURN';
'void' return 'VOID';
'print' return 'PRINT';
'println' return 'PRINTLN';
'tolower' return 'TOLOWER';
'toupper' return 'TOUPPER';
'round' return 'ROUND';
'length' return 'LENGTH';
'typeof' return 'TYPEOF';
'tostring' return 'TOSTRING';
'tochararray' return 'TOCHARARRAY';
'push' return 'PUSH';
'pop' return 'POP';
'main' return 'RUN';

// identifiers
[0-9a-zA-Z_]+ return 'IDENTIFIER';

<<EOF>> return 'EOF'; // end of file
. { throw new LexicalErrorEx(`Token: ${yytext}, no reconocido como parte del lenguaje`, yylloc.first_line, yylloc.first_column); }

/lex

// define precedence and associativity
%right 'TERNARY_IF', 'TERNARY_ELSE'
%left 'OR'
%left 'AND'
%right 'NOT'
%left 'LESS' 'GREATER' 'LESS_EQUAL' 'GREATER_EQUAL' 'EQUAL' 'NOT_EQUAL'
%left 'ADD', 'MINUS'
%left 'PRODUCT', 'DIVISION'
%left 'MODULE', 'POWER'
%left 'OPEN_PARENTHESIS', 'CLOSE_PARENTHESIS'
%start ini

%%

ini: main_statements EOF { return $1; };

// main statements
main_statements: main_statements main_statement { $1.push($2); $$ = $1; }
    | main_statement { $$ = new Array<IStatement>(); $$[0] = $1; };

// main statement
main_statement: run_st END_SENTENCE { $$ = $1; }
    | function { $$ = $1; }
    | method { $$ = $1; };

// standard statements
standard_statements: standard_statements standard_statement { $1.push($2); $$ = $1; }
    | standard_statement { $$ = new Array<IStatement>(); $$[0] = $1; };

// standard statement
standard_statement: declare_array_1 END_SENTENCE { $$ = $1; }
    //| declare_array_2 END_SENTENCE { $$ = $1; }
  
    | declare_arrayList END_SENTENCE 
    | declaration END_SENTENCE { $$ = $1; }
    |add_list END_SENTENCE
    | assign END_SENTENCE { $$ = $1; }
    | print_st END_SENTENCE { $$ = $1; }
    | println_st END_SENTENCE { $$ = $1; }
    | if { $$ = $1; }
    | while { $$ = $1; }
    | do_while { $$ = $1; }
    | do_until { $$ = $1; }
    | for { $$ = $1; }
    | switch { $$ = $1; }
    | call END_SENTENCE { $$ = $1; }
    | increment END_SENTENCE { $$ = $1; }
    | decrement END_SENTENCE { $$ = $1; }
    | BREAK END_SENTENCE { $$ = new BreakLoop(@1.first_line, @1.first_column); }
    | CONTINUE END_SENTENCE { $$ = new ContinueLoop(@1.first_line, @1.first_column); }
    | RETURN expr END_SENTENCE { $$ = new Return($2, @1.first_line, @1.first_column); }
     | RETURN END_SENTENCE { $$ = new Return(undefined, @1.first_line, @1.first_column); };


// expression
expr: arithmetic { $$ = $1; }
    | relational { $$ = $1; }
    | logical { $$ = $1; }
    | ternary { $$ = $1; }
    | group { $$ = $1; }
    | value { $$ = $1; }
    | cast { $$ = $1; }
    | increment { $$ = $1; }
    | decrement { $$ = $1; }
    | call { $$ = $1; }
    | access_array { $$ = $1; }
    |acces_arrayList 
    //| access_matrix { $$ = $1; }
    | to_lower_st { $$ = $1; }
    | to_upper_st { $$ = $1; }
    | round_st { $$ = $1; }
    | typeof_st { $$ = $1; }
    | tostring_st { $$ = $1; };


// relational expression
relational: expr LESS expr { $$ = new Relational($1, RelationalOp.LESS_THAN, $3, @1.first_line, @1.first_column); }
    | expr GREATER expr { $$ = new Relational($1, RelationalOp.GREATER_THAN, $3, @1.first_line, @1.first_column); }
    | expr LESS_EQUAL expr { $$ = new Relational($1, RelationalOp.LESS_THAN_EQUAL, $3, @1.first_line, @1.first_column); }
    | expr GREATER_EQUAL expr { $$ = new Relational($1, RelationalOp.GREATER_THAN_EQUAL, $3, @1.first_line, @1.first_column); }
    | expr EQUAL expr { $$ = new Relational($1, RelationalOp.EQUAL, $3, @1.first_line, @1.first_column); }
    | expr NOT_EQUAL expr { $$ = new Relational($1, RelationalOp.NOT_EQUAL, $3, @1.first_line, @1.first_column); };

// arithmetic operators
arithmetic: expr ADD expr { $$ = new Arithmetic($1, ArithmeticOp.ADD, $3, @1.first_line, @1.first_column); }
    | expr MINUS expr { $$ = new Arithmetic($1, ArithmeticOp.MINUS, $3, @1.first_line, @1.first_column); }
    | expr PRODUCT expr { $$ = new Arithmetic($1, ArithmeticOp.PRODUCT, $3, @1.first_line, @1.first_column); }
    | expr DIVISION expr { $$ = new Arithmetic($1, ArithmeticOp.DIVISION, $3, @1.first_line, @1.first_column); }
    | expr MODULE expr { $$ = new Arithmetic($1, ArithmeticOp.MODULE, $3, @1.first_line, @1.first_column); }
    | expr POWER expr { $$ = new Arithmetic($1, ArithmeticOp.POWER, $3, @1.first_line, @1.first_column); }
    | MINUS expr %prec 'MINUS' {$$ = new Negative($2, @1.first_line, @1.first_column); };

// logical operators
logical: expr AND expr { $$ = new Logical($1, LogicalOp.AND, $3, @1.first_line, @1.first_column); }
    | expr OR expr { $$ = new Logical($1, LogicalOp.OR, $3, @1.first_line, @1.first_column); }
    | NOT expr { $$ = new Not($2, @1.first_line, @1.first_column); };

// values
value: DECIMAL { $$ = new Terminal(Terminals.DECIMAL, Number($1), @1.first_line, @1.first_column); }
    | INTEGER { $$ = new Terminal(Terminals.INTEGER, Number($1), @1.first_line, @1.first_column); }
    | LOGICAL { $$ = new Terminal(Terminals.LOGICAL, fnParseBoolean($1, @1.first_line, @1.first_column), @1.first_line, @1.first_column); }
    | STRING { $$ = new Terminal(Terminals.STRING, $1, @1.first_line, @1.first_column); }
    | CHAR { $$ = new Terminal(Terminals.CHAR, $1, @1.first_line, @1.first_column); }
    | IDENTIFIER { $$ = new Terminal(Terminals.ID, $1, @1.first_line, @1.first_column); };

// ternary operator
ternary: expr TERNARY_IF expr TERNARY_ELSE expr { $$ = new Ternary($1, $3, $5, @1.first_line, @1.first_column); };

// group of expressions
group: OPEN_PARENTHESIS expr CLOSE_PARENTHESIS { $$ = $2; };

// cast
cast: OPEN_PARENTHESIS TYPE CLOSE_PARENTHESIS expr { $$ = new Cast(fnParseDatatype($2, @1.first_line, @1.first_column), $4, @1.first_line, @1.first_column); };

// increment
increment: IDENTIFIER INCREMENT { $$ = new Increment($1, @1.first_line, @1.first_column); };

// decrement
decrement: IDENTIFIER DECREMENT { $$ = new Decrement($1,@1.first_line, @1.first_column); };

// list of identifiers
list_identifiers: list_identifiers COMMA IDENTIFIER { $1.push($3); $$ = $1; }
    | IDENTIFIER { $$ = [$1]; };

// declaration
declaration: TYPE list_identifiers { $$ = new Declaration(fnParseDatatype($1, @1.first_line, @1.first_column), $2, undefined, @1.first_line, @1.first_column); }
    | TYPE list_identifiers ASSIGNMENT expr { $$ = new Declaration(fnParseDatatype($1, @1.first_line, @1.first_column), $2, $4, @1.first_line, @1.first_column); };

// assign
assign: list_identifiers ASSIGNMENT expr { $$ = new Assign($1, $3, @1.first_line, @1.first_column); };


// if-elif-else
if: IF OPEN_PARENTHESIS expr CLOSE_PARENTHESIS OPEN_BRACE standard_statements CLOSE_BRACE { $$ = new If($3, $6, undefined, undefined, @1.first_line, @1.first_column); }
    | IF OPEN_PARENTHESIS expr CLOSE_PARENTHESIS OPEN_BRACE standard_statements CLOSE_BRACE ELSE OPEN_BRACE standard_statements CLOSE_BRACE { $$ = new If($3, $6, undefined, $10, @1.first_line, @1.first_column); }
    | IF OPEN_PARENTHESIS expr CLOSE_PARENTHESIS OPEN_BRACE standard_statements CLOSE_BRACE elifs { $$ = new If($3, $6, $8, undefined, @1.first_line, @1.first_column); }
    | IF OPEN_PARENTHESIS expr CLOSE_PARENTHESIS OPEN_BRACE standard_statements CLOSE_BRACE elifs ELSE OPEN_BRACE standard_statements CLOSE_BRACE { $$ = new If($3, $6, $8, $11, @1.first_line, @1.first_column); };

// elifs
elifs: elifs ELIF OPEN_PARENTHESIS expr CLOSE_PARENTHESIS OPEN_BRACE standard_statements CLOSE_BRACE { $1.push(new Elif($4, $7, @1.first_line, @1.first_column)); $$ = $1; }
    | ELIF OPEN_PARENTHESIS expr CLOSE_PARENTHESIS OPEN_BRACE standard_statements CLOSE_BRACE { $$ = new Array<Elif>(); $$[0] = new Elif($3, $6, @1.first_line, @1.first_column); };

// while loop
while: WHILE OPEN_PARENTHESIS expr CLOSE_PARENTHESIS OPEN_BRACE standard_statements CLOSE_BRACE { $$ = new While($3, $6, @1.first_line, @1.first_column); };

// do-while loop
do_while: DO OPEN_BRACE standard_statements CLOSE_BRACE WHILE OPEN_PARENTHESIS expr CLOSE_PARENTHESIS END_SENTENCE { $$ = new DoWhile($7, $3, @1.first_line, @1.first_column); };

// do-until loop
do_until: DO OPEN_BRACE standard_statements CLOSE_BRACE UNTIL OPEN_PARENTHESIS expr CLOSE_PARENTHESIS END_SENTENCE { $$ = new DoUntil($7, $3, @1.first_line, @1.first_column); };

// parameters
parameters: parameters COMMA TYPE IDENTIFIER { $1.push({datatype: fnParseDatatype($3, @1.first_line, @1.first_column), id: $4}); $$ = $1; }
    | TYPE IDENTIFIER { $$ = new Array<IParam>(); $$[0] = {datatype: fnParseDatatype($1, @1.first_line, @1.first_column), id: $2}; };

// function
function: TYPE IDENTIFIER OPEN_PARENTHESIS parameters CLOSE_PARENTHESIS  OPEN_BRACE standard_statements CLOSE_BRACE { $$ = new FunctionDef($2, $4, fnParseDatatype($1, @1.first_line, @1.first_column), $7, @1.first_line, @1.first_column); }
    | TYPE IDENTIFIER OPEN_PARENTHESIS CLOSE_PARENTHESIS   OPEN_BRACE standard_statements CLOSE_BRACE { $$ = new FunctionDef($2, undefined, fnParseDatatype($1, @1.first_line, @1.first_column), $6, @1.first_line, @1.first_column); };

// method
method: VOID IDENTIFIER OPEN_PARENTHESIS parameters CLOSE_PARENTHESIS  OPEN_BRACE standard_statements CLOSE_BRACE { $$ = new Method($2, $4, $7, @1.first_line, @1.first_column); }
    //|VOID IDENTIFIER OPEN_PARENTHESIS parameters CLOSE_PARENTHESIS OPEN_BRACE standard_statements CLOSE_BRACE { $$ = new Method($1, $3, $6, @1.first_line, @1.first_column); }
    //| VOID IDENTIFIER OPEN_PARENTHESIS CLOSE_PARENTHESIS OPEN_BRACE standard_statements CLOSE_BRACE { $$ = new Method($1, undefined, $7, @1.first_line, @1.first_column); }
    |VOID IDENTIFIER OPEN_PARENTHESIS CLOSE_PARENTHESIS OPEN_BRACE standard_statements CLOSE_BRACE { $$ = new Method($2, undefined, $6, @1.first_line, @1.first_column); };

    
// arguments
arguments: arguments COMMA expr { $1.push($3); $$ = $1; }
    | expr { $$ = new Array<IExpression>(); $$[0] = $1; };

// call
call: IDENTIFIER OPEN_PARENTHESIS arguments CLOSE_PARENTHESIS { $$ = new Call($1, $3, @1.first_line, @1.first_column); }
    | IDENTIFIER OPEN_PARENTHESIS CLOSE_PARENTHESIS { $$ = new Call($1, undefined, @1.first_line, @1.first_column); };

// for loop
for: FOR OPEN_PARENTHESIS for_init END_SENTENCE expr END_SENTENCE for_update CLOSE_PARENTHESIS OPEN_BRACE standard_statements CLOSE_BRACE { $$ = new For($3, $5, $7, $10, @1.first_line, @1.first_column); };

for_init: assign { $$ = $1; }
    | declaration { $$ = $1; };

for_update: assign { $$ = $1; }
    | increment { $$ = $1; }
    | decrement { $$ = $1; };

// switch-case
switch: SWITCH OPEN_PARENTHESIS expr CLOSE_PARENTHESIS OPEN_BRACE cases CLOSE_BRACE { $$ = new Switch($3, $6, undefined, @1.first_line, @1.first_column); }
    | SWITCH OPEN_PARENTHESIS expr CLOSE_PARENTHESIS OPEN_BRACE cases DEFAULT TERNARY_ELSE standard_statements CLOSE_BRACE { $$ = new Switch($3, $6, $9, @1.first_line, @1.first_column); }
    | SWITCH OPEN_PARENTHESIS expr CLOSE_PARENTHESIS OPEN_BRACE DEFAULT TERNARY_ELSE standard_statements CLOSE_BRACE { $$ = new Switch($3, undefined, $7, @1.first_line, @1.first_column); };

cases: cases CASE expr TERNARY_ELSE standard_statements { $1.push(new Case($3, $5,@1.first_line, @1.first_column)); $$ = $1; }
    | CASE expr TERNARY_ELSE standard_statements { $$ = new Array<Case>(); $$[0] = new Case($2, $4,@1.first_line, @1.first_column); };

// declare array one dimension
declare_array_1: TYPE OPEN_BRACKET CLOSE_BRACKET IDENTIFIER ASSIGNMENT NEW TYPE OPEN_BRACKET expr CLOSE_BRACKET { $$ = new DeclareArrayOne(fnParseDatatype($1, @1.first_line, @1.first_column), $4, $9, undefined, @1.first_line, @1.first_column); }
    | TYPE OPEN_BRACKET CLOSE_BRACKET IDENTIFIER ASSIGNMENT OPEN_BRACE list_expr CLOSE_BRACE { $$ = new DeclareArrayOne(fnParseDatatype($1, @1.first_line, @1.first_column), $4, undefined, $7, @1.first_line, @1.first_column); };

list_expr: list_expr COMMA expr { $1.push($3); $$ = $1; }
    | expr { $$ = new Array<IExpression>(); $$[0] = $1; };

list_list_expr: list_list_expr COMMA OPEN_BRACE list_expr CLOSE_BRACE { $1.push($3); $$ = $1; }
    | OPEN_BRACE list_expr CLOSE_BRACE { $$ = new Array<Array<IExpression>>(); $$[0] = $1; };

// declare array two dimension
//declare_array_2: TYPE OPEN_BRACKET CLOSE_BRACKET OPEN_BRACKET CLOSE_BRACKET IDENTIFIER ASSIGNMENT NEW TYPE OPEN_BRACKET expr CLOSE_BRACKET OPEN_BRACKET expr CLOSE_BRACKET { $$ = new DeclareArrayTwo(fnParseDatatype($1, @1.first_line, @1.first_column), $6, undefined, $11, $14, @1.first_line, @1.first_column); }
  //  | TYPE OPEN_BRACKET CLOSE_BRACKET OPEN_BRACKET CLOSE_BRACKET IDENTIFIER ASSIGNMENT OPEN_BRACE list_list_expr CLOSE_BRACE { $$ = new DeclareArrayTwo(fnParseDatatype($1,@1.first_line, @1.first_column), $6, $9, undefined, undefined, @1.first_line, @1.first_column); };
//declare arrayList
declare_arrayList:
                LIST LESS TYPE GREATER IDENTIFIER ASSIGNMENT NEW  LIST LESS TYPE GREATER { $$ = new DeclareArrayOne(fnParseDatatype($3, @1.first_line, @1.first_column), $5, undefined, undefined, @1.first_line, @1.first_column); }
;
// access array
add_list: IDENTIFIER PUNTO ADDLIST OPEN_PARENTHESIS expr CLOSE_PARENTHESIS ;
access_array: IDENTIFIER OPEN_BRACKET expr CLOSE_BRACKET { $$ = new AccessArray($1, $3, @1.first_line, @1.first_column); };


acces_arrayList: IDENTIFIER OPEN_BRACKET OPEN_BRACKET expr CLOSE_BRACKET CLOSE_BRACKET;
// access matrix
//access_matrix: IDENTIFIER OPEN_BRACKET expr CLOSE_BRACKET OPEN_BRACKET expr CLOSE_BRACKET { $$ = new AccessMatrix($1, $3, $6, @1.first_line, @1.first_column); };
//
// print
print_st: PRINT OPEN_PARENTHESIS expr CLOSE_PARENTHESIS { $$ = new Print($3, @1.first_line, @1.first_column); };

// println
println_st: PRINTLN OPEN_PARENTHESIS expr CLOSE_PARENTHESIS { $$ = new Println($3, @1.first_line, @1.first_column); };

// to lower case
to_lower_st: TOLOWER OPEN_PARENTHESIS expr CLOSE_PARENTHESIS { $$ = new ToLower($3, @1.first_line, @1.first_column); };

// to upper case
to_upper_st: TOUPPER OPEN_PARENTHESIS expr CLOSE_PARENTHESIS { $$ = new ToUpper($3, @1.first_line, @1.first_column); };

// round
round_st: ROUND OPEN_PARENTHESIS expr CLOSE_PARENTHESIS { $$ = new Round($3, @1.first_line, @1.first_column); };

// typeof
typeof_st: TYPEOF OPEN_PARENTHESIS expr CLOSE_PARENTHESIS { $$ = new TypeOf($3, @1.first_line, @1.first_column); };

// tostring
tostring_st: TOSTRING OPEN_PARENTHESIS expr CLOSE_PARENTHESIS { $$ = new ToString($3, @1.first_line, @1.first_column); };


// run
run_st: RUN IDENTIFIER OPEN_PARENTHESIS list_expr CLOSE_PARENTHESIS { $$ = new Run($2, $4, @1.first_line, @1.first_column); }
    | RUN IDENTIFIER OPEN_PARENTHESIS CLOSE_PARENTHESIS { $$ = new Run($2, undefined, @1.first_line, @1.first_column); };
