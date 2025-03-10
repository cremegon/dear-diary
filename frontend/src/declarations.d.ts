declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.jpg" {
  const content: string;
  export default content;
}

declare module "*.png" {
  const content: string;
  export default content;
}

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
