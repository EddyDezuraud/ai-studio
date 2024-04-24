interface Colors {
  primary: string;
  secondary: string;
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
  
interface StylesConfig {
  colors: Colors;
  body: Body;
  form: Form;
  texts: Texts;
  block: Block;
}

export { StylesConfig, Colors, Body, ButtonStyles, InputStyles, FormButtons, Form, TextStyles, Texts, Block};