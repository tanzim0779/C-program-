/*
 * MILKWAY — Number System Converter (C learning version)
 * Converts a non-negative decimal integer to bases 2, 8 and 16.
 * Compile: gcc number_converter.c -o converter
 *
 * The website itself currently converts values in JavaScript using BigInt.
 * This companion C program is for learning and can be connected to WebAssembly
 * in a later development step.
 */
#include <stdio.h>

void convert(unsigned long long number, unsigned int base) {
    char digits[] = "0123456789ABCDEF";
    char output[65];
    int index = 0;

    if (number == 0) {
        puts("0");
        return;
    }

    while (number > 0 && index < (int)sizeof(output) - 1) {
        output[index++] = digits[number % base];
        number /= base;
    }
    while (index > 0) putchar(output[--index]);
    putchar('\n');
}

int main(void) {
    unsigned long long decimal;
    printf("MILKWAY Number System Converter\n");
    printf("Enter a non-negative decimal integer: ");

    if (scanf("%llu", &decimal) != 1) {
        puts("Invalid input.");
        return 1;
    }

    printf("Binary:      "); convert(decimal, 2);
    printf("Octal:       "); convert(decimal, 8);
    printf("Decimal:     %llu\n", decimal);
    printf("Hexadecimal: "); convert(decimal, 16);
    return 0;
}
