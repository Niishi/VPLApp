start
    = number

number = parts:$(int){
    return parts;
}

int
    = digit19 digits / digit

digit19 = [1-9]
digit = [0-9]
digits = digit+
