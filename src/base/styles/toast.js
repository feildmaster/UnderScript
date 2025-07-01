import style from 'src/utils/style.js';

style.add(`
  #AlertToast {
    height: 0;
  }
  #AlertToast .dismissable > span {
    display: block;
    text-align: center;
  }
  #AlertToast .dismissable .dismiss {
    background-color: transparent;
    border: 1px solid #fff;
    display: block;
    font-family: DTM-Mono;
    font-size: 14px;
    margin: 5px auto;
    max-width: 80%;
    min-width: 160px;
    text-transform: capitalize;
  }
  #AlertToast .dismissable .dismiss:hover {
    opacity: 0.6;
  }
`);
