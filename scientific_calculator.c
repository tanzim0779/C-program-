/*
 * MILKWAY — Scientific Calculator (C learning version)
 * Compile on a computer with a C compiler:
 *   gcc scientific_calculator.c -o calculator -lm
 *
 * This console program demonstrates the calculation core. The website's
 * current browser interface uses JavaScript; this C file is not yet compiled
 * to WebAssembly or connected to the website.
 */
#include <stdio.h>
#include <math.h>

int main(void) {
    int choice;
    double a, b;

    puts("MILKWAY Scientific Calculator");
    puts("1. Add  2. Subtract  3. Multiply  4. Divide");
    puts("5. Power  6. Square root  7. sin(x)  8. log10(x)");
    printf("Choose an operation: ");
    if (scanf("%d", &choice) != 1) {
        puts("Invalid choice.");
        return 1;
    }

    switch (choice) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
            printf("Enter two numbers: ");
            if (scanf("%lf %lf", &a, &b) != 2) {
                puts("Invalid number.");
                return 1;
            }
            if (choice == 1) printf("Result: %.10g\n", a + b);
            else if (choice == 2) printf("Result: %.10g\n", a - b);
            else if (choice == 3) printf("Result: %.10g\n", a * b);
            else if (choice == 4) {
                if (b == 0.0) puts("Error: division by zero.");
                else printf("Result: %.10g\n", a / b);
            } else printf("Result: %.10g\n", pow(a, b));
            break;
        case 6:
            printf("Enter a number: ");
            if (scanf("%lf", &a) != 1 || a < 0) {
                puts("Please enter a non-negative number.");
                return 1;
            }
            printf("Result: %.10g\n", sqrt(a));
            break;
        case 7:
            printf("Enter angle in degrees: ");
            if (scanf("%lf", &a) != 1) {
                puts("Invalid number.");
                return 1;
            }
            printf("Result: %.10g\n", sin(a * acos(-1.0) / 180.0));
            break;
        case 8:
            printf("Enter a positive number: ");
            if (scanf("%lf", &a) != 1 || a <= 0) {
                puts("Logarithm requires a positive number.");
                return 1;
            }
            printf("Result: %.10g\n", log10(a));
            break;
        default:
            puts("Unknown operation.");
            return 1;
    }
    return 0;
}
