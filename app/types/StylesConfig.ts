interface Color {
  hex: string;
  title?: string;
  description: string;
}

interface Colors {
  primary: string;
  secondary: string;
  website: Color[];
  logo: Color[];
  list: string[];
}
  
interface Body {
  background: string;
  color: string;
  fontSize: string;
  fontFamily: string;
  lineHeight: string;
}
  
interface ButtonStyles {
  height: string;
  width: string;
  padding: string;
  borderRadius: string;
  background: string;
  border: string; 
  color: string;
  fontSize: string;
  fontFamily: string;
  boxShadow: string;
  transition: string;
  classNames: string[];
  content: string;
  htmlContent: string;
}
  
interface InputStyles {
  height: string;
  width: string;
  padding: string;
  borderRadius: string;
  border: string;
  color: string;
  fontSize: string;
  fontFamily: string;
  boxShadow: string;
  transition: string;
  classNames: string[];
}
  
interface FormButtons {
  primary: ButtonStyles;
  secondary: ButtonStyles;
}
  
interface Form {
  buttons: FormButtons;
  input: InputStyles;
}
  
interface TextStyles {
  color: string;
  fontSize: string;
  fontFamily: string;
}
  
interface Texts {
  title: TextStyles;
  paragraph: TextStyles;
}
  
interface Block {
  padding: string;
  borderRadius: string;
  background: string;
  boxShadow: string;
  border: string;
}

interface Logo {
  rate: number;
  src: string;
  alt: string;
  type: "img" | "svg" | "social";
}

interface Employees {
  name: string;
  job: string;
  url: string;
  photo: string;
}

interface Linkedin {
  url: string;
  logo: string;
  nbEmployees: number;
  employees: Employees[];
}

interface Socials {
  linkedin?: Linkedin;
}

interface Metadata {
  name: string;
  description: string;
  logos: Logo[];
  favicon: string;
}

interface StylesConfig {
  metaData: Metadata;
  colors: Colors;
  body: Body;
  form: Form;
  texts: Texts;
  block: Block;
  socials: Socials;
}

export type { StylesConfig, Colors, Color, Body, ButtonStyles, InputStyles, FormButtons, Form, TextStyles, Texts, Block, Metadata, Logo, Linkedin, Socials, Employees};