import java.util.Scanner;

public class Multiplication {

    public static double multiply(double a, double b) {
        return a * b;
    }

    public static void main(String[] args) {
        try (Scanner scanner = new Scanner(System.in)) {
            System.out.print("Enter first number: ");
            double a = scanner.nextDouble();
            System.out.print("Enter second number: ");
            double b = scanner.nextDouble();
            System.out.println("Product: " + multiply(a, b));
        } catch (java.util.InputMismatchException e) {
            System.out.println("Error: please enter a valid number");
        }
    }
}
