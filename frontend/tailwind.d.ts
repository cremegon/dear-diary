declare module "tailwind.config" {
  interface TailwindConfig {
    theme: {
      extend: {
        fontFamily: {
          [key: string]: string[]; // Ensure fontFamily is of type array of strings
        };
      };
    };
  }
}
