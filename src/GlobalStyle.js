// src/GlobalStyle.js
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
  body {
    margin: 0;
    font-family: 'Arial', sans-serif;
    background-color: #f9f9f9;
  }
`;

export default GlobalStyle;
