"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }// src/constants/api.ts
var url = process.env.NODE_ENV === "test" ? "http://localhost/" : _nullishCoalesce(process.env.NEXT_PUBLIC_API_URL, () => ( (typeof window !== "undefined" ? window.location.origin : "")));
if (url && String(url).endsWith("/")) {
  url = url.slice(0, -1);
}
var apiUrl = url;
var gqlUrl = `${url}/graphql`;
var searchableAttributeUrl = "?isSearchable=true";
var authHeader = "Authorization";
var languageHeader = "Elasticsuite-Language";
var contentTypeHeader = "Content-Type";
var authErrorCodes = [401, 403];
var currentPage = "currentPage";
var pageSize = "pageSize";
var usePagination = "pagination";
var searchParameter = "search";
var defaultPageSize = 50;

// src/types/customTables.ts
var MassiveSelectionType = /* @__PURE__ */ ((MassiveSelectionType2) => {
  MassiveSelectionType2["ALL"] = "massiveselection.all";
  MassiveSelectionType2["ALL_ON_CURRENT_PAGE"] = "massiveselection.allOnCurrentPage";
  MassiveSelectionType2["NONE"] = "massiveselection.none";
  return MassiveSelectionType2;
})(MassiveSelectionType || {});
var DataContentType = /* @__PURE__ */ ((DataContentType2) => {
  DataContentType2["STRING"] = "string";
  DataContentType2["BOOLEAN"] = "boolean";
  DataContentType2["TAG"] = "tag";
  DataContentType2["LABEL"] = "label";
  DataContentType2["DROPDOWN"] = "dropdown";
  DataContentType2["IMAGE"] = "image";
  DataContentType2["SCORE"] = "score";
  DataContentType2["STOCK"] = "stock";
  DataContentType2["PRICE"] = "price";
  DataContentType2["NUMBER"] = "number";
  return DataContentType2;
})(DataContentType || {});

// src/types/fetch.ts
var HttpCode = /* @__PURE__ */ ((HttpCode2) => {
  HttpCode2["OK"] = "200";
  HttpCode2["CREATED"] = "201";
  HttpCode2["NO_CONTENT"] = "204";
  HttpCode2["BAD_REQUEST"] = "400";
  HttpCode2["NOT_FOUND"] = "404";
  HttpCode2["UNPROCESSABLE_ENTITY"] = "422";
  return HttpCode2;
})(HttpCode || {});
var Method = /* @__PURE__ */ ((Method2) => {
  Method2["DELETE"] = "DELETE";
  Method2["GET"] = "GET";
  Method2["PATCH"] = "PATCH";
  Method2["POST"] = "POST";
  Method2["PUT"] = "PUT";
  return Method2;
})(Method || {});
var LoadStatus = /* @__PURE__ */ ((LoadStatus2) => {
  LoadStatus2[LoadStatus2["FAILED"] = 0] = "FAILED";
  LoadStatus2[LoadStatus2["IDLE"] = 1] = "IDLE";
  LoadStatus2[LoadStatus2["LOADING"] = 2] = "LOADING";
  LoadStatus2[LoadStatus2["SUCCEEDED"] = 3] = "SUCCEEDED";
  return LoadStatus2;
})(LoadStatus || {});

// src/types/hydra.ts
var HydraType = /* @__PURE__ */ ((HydraType2) => {
  HydraType2["ARRAY"] = "array";
  HydraType2["BOOLEAN"] = "boolean";
  HydraType2["INTEGER"] = "integer";
  HydraType2["OBJECT"] = "object";
  HydraType2["STRING"] = "string";
  return HydraType2;
})(HydraType || {});

// src/types/rules.ts
var RuleType = /* @__PURE__ */ ((RuleType2) => {
  RuleType2["ATTRIBUTE"] = "attribute";
  RuleType2["COMBINATION"] = "combination";
  return RuleType2;
})(RuleType || {});
var RuleAttributeOperator = /* @__PURE__ */ ((RuleAttributeOperator2) => {
  RuleAttributeOperator2["CONTAINS"] = "contains";
  RuleAttributeOperator2["DOES_NOT_CONTAINS"] = "does_not_contains";
  RuleAttributeOperator2["IS_ONE_OF"] = "is_one_of";
  RuleAttributeOperator2["IS_NOT_ONE_OF"] = "is_not_one_of";
  RuleAttributeOperator2["GTE"] = "gte";
  RuleAttributeOperator2["LTE"] = "lte";
  RuleAttributeOperator2["GT"] = "gt";
  RuleAttributeOperator2["LT"] = "lt";
  RuleAttributeOperator2["EQ"] = "eq";
  RuleAttributeOperator2["NEQ"] = "neq";
  RuleAttributeOperator2["IS"] = "is";
  RuleAttributeOperator2["IS_NOT"] = "is_not";
  return RuleAttributeOperator2;
})(RuleAttributeOperator || {});
var RuleAttributeType = /* @__PURE__ */ ((RuleAttributeType2) => {
  RuleAttributeType2["BOOLEAN"] = "boolean";
  RuleAttributeType2["CATEGORY"] = "category";
  RuleAttributeType2["DROPDOWN"] = "dropdown";
  RuleAttributeType2["FLOAT"] = "float";
  RuleAttributeType2["INT"] = "int";
  RuleAttributeType2["NUMBER"] = "number";
  RuleAttributeType2["PRICE"] = "price";
  RuleAttributeType2["REFERENCE"] = "reference";
  RuleAttributeType2["SELECT"] = "select";
  RuleAttributeType2["TEXT"] = "text";
  return RuleAttributeType2;
})(RuleAttributeType || {});
var RuleCombinationOperator = /* @__PURE__ */ ((RuleCombinationOperator2) => {
  RuleCombinationOperator2["ALL"] = "all";
  RuleCombinationOperator2["ANY"] = "any";
  return RuleCombinationOperator2;
})(RuleCombinationOperator || {});

// src/types/user.ts
var Role = /* @__PURE__ */ ((Role2) => {
  Role2["ADMIN"] = "ROLE_ADMIN";
  Role2["CONTRIBUTOR"] = "ROLE_CONTRIBUTOR";
  return Role2;
})(Role || {});

// src/constants/customTable.ts
var reorderingColumnWidth = 48;
var selectionColumnWidth = 80;
var stickyColunWidth = 180;
var productTableheader = [
  {
    name: "sku",
    label: "Code",
    type: "string" /* STRING */
  },
  {
    name: "name",
    label: "Name",
    type: "string" /* STRING */
  },
  {
    name: "score",
    label: "Score",
    type: "score" /* SCORE */
  },
  {
    name: "stock",
    label: "Stock",
    type: "stock" /* STOCK */
  },
  {
    name: "price",
    label: "Price",
    type: "price" /* PRICE */
  }
];
var defaultRowsPerPageOptions = [10, 25, 50];

// src/constants/graphql.ts
var productsQuery = `query getProducts($catalogId: String!, $currentPage: Int, $pageSize: Int) {
  searchProducts(catalogId: $catalogId, currentPage: $currentPage, pageSize: $pageSize ) {
    collection {
      ... on Product {
        id
        sku
        name
        score
        stock {
          status
        }
        price
      }
    }
    paginationInfo {
      lastPage
      itemsPerPage
      totalCount
    }
  }
}
`;

// src/constants/hydra.ts
var booleanRegexp = /^is([A-Z][a-zA-Z]+)/;
var headerRegexp = /<(.+)>; rel="http:\/\/www.w3.org\/ns\/hydra\/core#apiDocumentation"/;

// src/constants/rules.ts
var emptyCombinationRule = {
  type: "combination" /* COMBINATION */,
  operator: "all" /* ALL */,
  value: "true",
  children: []
};
var emptyAttributeRule = {
  type: "attribute" /* ATTRIBUTE */,
  field: "",
  operator: "",
  attribute_type: "text" /* TEXT */,
  value: ""
};
var operatorsByType = /* @__PURE__ */ new Map([
  ["boolean" /* BOOLEAN */, ["is" /* IS */]],
  [
    "category" /* CATEGORY */,
    ["is_one_of" /* IS_ONE_OF */, "is_not_one_of" /* IS_NOT_ONE_OF */]
  ],
  [
    "dropdown" /* DROPDOWN */,
    ["is_one_of" /* IS_ONE_OF */, "is_not_one_of" /* IS_NOT_ONE_OF */]
  ],
  [
    "float" /* FLOAT */,
    [
      "eq" /* EQ */,
      "neq" /* NEQ */,
      "gt" /* GT */,
      "gte" /* GTE */,
      "lt" /* LT */,
      "lte" /* LTE */
    ]
  ],
  [
    "int" /* INT */,
    [
      "eq" /* EQ */,
      "neq" /* NEQ */,
      "gt" /* GT */,
      "gte" /* GTE */,
      "lt" /* LT */,
      "lte" /* LTE */
    ]
  ],
  [
    "number" /* NUMBER */,
    [
      "eq" /* EQ */,
      "neq" /* NEQ */,
      "gt" /* GT */,
      "gte" /* GTE */,
      "lt" /* LT */,
      "lte" /* LTE */
    ]
  ],
  [
    "price" /* PRICE */,
    [
      "eq" /* EQ */,
      "neq" /* NEQ */,
      "gt" /* GT */,
      "gte" /* GTE */,
      "lt" /* LT */,
      "lte" /* LTE */
    ]
  ],
  [
    "reference" /* REFERENCE */,
    ["contains" /* CONTAINS */, "does_not_contains" /* DOES_NOT_CONTAINS */]
  ],
  [
    "select" /* SELECT */,
    ["is_one_of" /* IS_ONE_OF */, "is_not_one_of" /* IS_NOT_ONE_OF */]
  ],
  [
    "text" /* TEXT */,
    ["contains" /* CONTAINS */, "does_not_contains" /* DOES_NOT_CONTAINS */]
  ]
]);

// src/constants/theme.tsx
var _styles = require('@mui/material/styles');
var _react = require('@emotion/react');
var buttonEnterKeyframe = _react.keyframes`
    0% {
      transform: scale(0);
      opacity: 0.3;
    }
    100% {
      transform: scale(1);
      opacity: 0.6;
    }
  `;
var theme = _styles.createTheme.call(void 0, {
  palette: {
    background: {
      page: "#FAFBFE"
    },
    primary: {
      light: "#FBC0B9",
      main: "#ED7465",
      dark: "#A02213"
    },
    secondary: {
      light: "#BABDFC",
      main: "#2C19CD",
      dark: "#1812A0"
    },
    neutral: {
      light: "#F4F7FF",
      main: "#B5B9D9",
      dark: "#2F3674",
      contrastText: "#FFFFFF"
    },
    error: {
      light: "#FFE7E4",
      main: "#A02213"
    },
    warning: {
      light: "#FEF9D0",
      main: "#60590D"
    },
    success: {
      light: "#E7F4EC",
      main: "#18753C"
    },
    menu: {
      text500: "#424880",
      text600: "#212250",
      hover: "#E7E8FF",
      active: "#2C19CD"
    },
    colors: {
      white: "#FFF",
      black: "#000",
      primary: {
        main: "#ED7465",
        100: "#FFE7E4",
        200: "#FBC0B9",
        300: "#F3978C",
        400: "#ED7465",
        500: "#E64733",
        600: "#CC2D19",
        700: "#A02213",
        800: "#73170C",
        900: "#460C05"
      },
      secondary: {
        main: "#2C19CD",
        100: "#E7E8FF",
        200: "#BABDFC",
        300: "#8D8DF3",
        400: "#6460ED",
        500: "#3F32E6",
        600: "#2C19CD",
        700: "#1812A0",
        800: "#0D1274",
        900: "#070F47"
      },
      neutral: {
        100: "#FAFBFE",
        200: "#F4F7FF",
        300: "#E2E6F3",
        400: "#B5B9D9",
        500: "#8187B9",
        600: "#424880",
        700: "#2F3674",
        800: "#212250",
        900: "#151A47"
      },
      gradient: {
        default: "linear-gradient(46.78deg, #E64733 1.79%, #ED7465 98.88%)",
        darken: "linear-gradient(46.78deg, #CC2D19 1.79%, #E64733 98.88%)"
      },
      shadow: {
        neutral: {
          sm: "4px 4px 14px rgba(226, 230, 243, 0.5)",
          md: "0px -8px 8px rgba(226, 230, 243, 0.2), 0px 5px 8px rgba(107, 113, 166, 0.1), 4px 4px 14px rgba(226, 230, 243, 0.5)",
          lg: "0px -8px 8px rgba(226, 230, 243, 0.2), 0px 8px 8px rgba(107, 113, 166, 0.2), 4px 4px 14px rgba(226, 230, 243, 0.5)"
        },
        primaryButton: {
          sm: "0px -8px 8px rgba(255, 231, 228, 0.2), 0px 8px 8px rgba(243, 151, 140, 0.2), 4px 4px 14px rgba(255, 231, 228, 0.5)",
          md: "0px -8px 8px rgba(255, 231, 228, 0.2), 0px 16px 16px rgba(243, 151, 140, 0.2), 4px 4px 14px rgba(255, 231, 228, 0.5)",
          lg: "0px -8px 8px rgba(255, 231, 228, 0.2), 0px 16px 36px rgba(243, 151, 140, 0.2), 4px 4px 14px rgba(255, 231, 228, 0.5)"
        },
        secondaryButton: {
          sm: "0px -8px 8px rgba(231, 232, 255, 0.2), 0px 8px 8px rgba(186, 189, 252, 0.05), 4px 4px 14px rgba(231, 232, 255, 0.5)",
          md: "0px -8px 8px rgba(231, 232, 255, 0.2), 0px 16px 16px rgba(186, 189, 252, 0.2), 4px 4px 14px rgba(231, 232, 255, 0.5)",
          lg: "0px -8px 8px rgba(231, 232, 255, 0.2), 0px 16px 36px rgba(186, 189, 252, 0.4), 4px 4px 14px rgba(231, 232, 255, 0.5)"
        }
      }
    },
    mode: "light"
  },
  shape: {
    borderRadius: 8
  },
  typography: {
    fontFamily: "Inter",
    h1: {
      fontSize: 36,
      lineHeight: "44px",
      fontWeight: 600
    },
    h2: {
      fontSize: 28,
      lineHeight: "38px",
      fontWeight: 600
    },
    h3: {
      fontSize: 24,
      lineHeight: "32px",
      fontWeight: 600
    },
    h4: {
      fontSize: 20,
      lineHeight: "30px",
      fontWeight: 600
    },
    h5: {
      fontSize: 18,
      lineHeight: "28px",
      fontWeight: 600
    },
    h6: {
      fontSize: 16,
      lineHeight: "24px",
      fontWeight: 600
    },
    body1: {
      fontSize: 14,
      lineHeight: "20px",
      fontWeight: 500
    },
    body2: {
      fontSize: 14,
      lineHeight: "20px",
      fontWeight: 400
    },
    caption: {
      fontSize: 12,
      lineHeight: "18px",
      fontWeight: 400
    }
  },
  components: {
    MuiCollapse: {
      styleOverrides: {
        wrapper: {
          width: "100%"
        },
        wrapperInner: {
          width: "100%"
        }
      }
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: false
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          minWidth: 32
        }
      }
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          transform: "scale(0.9)",
          color: "#B5B9D9",
          transition: "all 0.3s linear",
          "&:hover": {
            backgroundColor: "rgba(21, 26, 71, 0.08)"
          },
          "&:focus": {
            backgroundColor: "rgba(21, 26, 71, 0.12)"
          },
          ".MuiTouchRipple-child": {
            backgroundColor: "rgba(21, 26, 71)"
          },
          "&.Mui-checked, &.MuiCheckbox-indeterminate": {
            "&:hover": {
              backgroundColor: "rgba(237, 116, 101, 0.08)"
            },
            "&:focus": {
              backgroundColor: "rgba(237, 116, 101, 0.12)"
            },
            ".MuiTouchRipple-child": {
              backgroundColor: "rgba(237, 116, 101)"
            }
          },
          "&.Mui-disabled": {
            color: "#E2E6F3"
          }
        }
      }
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          transform: "scale(0.9)",
          color: "#B5B9D9",
          transition: "all 0.3s linear",
          "&:hover": {
            backgroundColor: "rgba(21, 26, 71, 0.08)"
          },
          "&:focus": {
            backgroundColor: "rgba(21, 26, 71, 0.12)"
          },
          ".MuiTouchRipple-child": {
            backgroundColor: "rgba(21, 26, 71)"
          },
          "&.Mui-checked": {
            "&:hover": {
              backgroundColor: "rgba(237, 116, 101, 0.08)"
            },
            "&:focus": {
              backgroundColor: "rgba(237, 116, 101, 0.12)"
            },
            ".MuiTouchRipple-child": {
              backgroundColor: "rgba(237, 116, 101)"
            }
          },
          "&.Mui-disabled": {
            color: "#E2E6F3"
          }
        }
      }
    },
    MuiSwitch: {
      styleOverrides: {
        thumb: {
          background: "#FFF",
          border: "1px solid #B5B9D9",
          boxSizing: "border-box",
          boxShadow: "0px 6px 10px rgba(0, 0, 0, 0.05)",
          borderRadius: "22px",
          width: "19px",
          height: "19px"
        },
        track: {
          backgroundColor: "#B5B9D9",
          borderRadius: "22px",
          opacity: "1",
          height: "13px"
        },
        switchBase: {
          transition: "all 0.3s linear",
          "&:hover": {
            backgroundColor: "rgba(21, 26, 71, 0.08)"
          },
          "&:focus": {
            backgroundColor: "rgba(21, 26, 71, 0.12)"
          },
          ".MuiTouchRipple-child": {
            backgroundColor: "rgba(21, 26, 71)"
          },
          "&.Mui-checked": {
            "&:hover": {
              backgroundColor: "rgba(237, 116, 101, 0.08)"
            },
            "&:focus": {
              backgroundColor: "rgba(237, 116, 101, 0.12)"
            },
            ".MuiTouchRipple-child": {
              backgroundColor: "rgba(237, 116, 101)"
            },
            "& .MuiSwitch-thumb": {
              border: "0",
              background: "linear-gradient(46.78deg, #E64733 1.79%, #ED7465 98.88%)",
              boxShadow: "0px 6px 10px rgba(237, 116, 101, 0.1)"
            },
            "& + .MuiSwitch-track": {
              backgroundColor: "#E64733",
              opacity: "0.2"
            }
          },
          "&.Mui-disabled": {
            "+ .MuiSwitch-track": {
              opacity: 1,
              backgroundColor: "rgba(181, 185, 217, 0.3)"
            },
            "& .MuiSwitch-thumb": {
              border: "1px solid rgba(181, 185, 217, 0.3)"
            },
            "&.Mui-checked": {
              "+ .MuiSwitch-track": {
                opacity: 0.2,
                backgroundColor: "rgba(230, 71, 51, 0.3)"
              },
              "& .MuiSwitch-thumb": {
                boxShadow: "none",
                opacity: 0.3
              }
            }
          }
        }
      }
    },
    MuiFab: {
      styleOverrides: {
        root: {
          color: "#FFF",
          fontSize: "26px",
          background: "linear-gradient(46.78deg, #E64733 1.79%, #ED7465 98.88%)",
          boxShadow: "0px -8px 8px rgba(255, 231, 228, 0.2), 0px 16px 16px rgba(243, 151, 140, 0.2), 4px 4px 14px rgba(255, 231, 228, 0.5)",
          width: "56px",
          height: "56px",
          zIndex: 1,
          "&::before": {
            position: "absolute",
            content: '""',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            borderRadius: "50%",
            background: "linear-gradient(46.78deg, #CC2D19 1.79%, #E64733 98.88%)",
            boxShadow: "0px -8px 8px rgba(255, 231, 228, 0.2), 0px 16px 36px rgba(243, 151, 140, 0.2), 4px 4px 14px rgba(255, 231, 228, 0.5)",
            zIndex: -1,
            transition: "opacity 0.3s linear",
            opacity: 0
          },
          "&:hover::before": {
            opacity: 1
          },
          "&:hover": {
            background: "linear-gradient(46.78deg, #E64733 1.79%, #ED7465 98.88%)",
            boxShadow: "0px -8px 8px rgba(255, 231, 228, 0.2), 0px 16px 16px rgba(243, 151, 140, 0.2), 4px 4px 14px rgba(255, 231, 228, 0.5)"
          },
          "&& .MuiTouchRipple-child": {
            backgroundColor: "#CC2D19",
            opacity: 1
          },
          "&& .MuiTouchRipple-rippleVisible": {
            animationName: `${buttonEnterKeyframe}`
          },
          "&.Mui-disabled": {
            color: "#8187B9",
            background: "#E2E6F3"
          }
        }
      }
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          color: "#151A47",
          fontSize: "14px",
          lineHeight: "20px",
          fontWeight: 400
        },
        label: {
          "&.Mui-disabled": {
            color: "#8187B9"
          }
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          WebkitTransform: "none",
          transform: "none",
          fontWeight: 500,
          lineHeight: "20px",
          color: "#151A47",
          "&.Mui-focused": {
            color: "#151A47"
          }
        },
        shrink: {
          fontSize: 14,
          color: "#151A47"
        },
        asterisk: {
          color: "#CC2D19"
        }
      }
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          display: "flex",
          color: "#424880",
          fontWeight: 400,
          fontSize: "12px",
          lineHeight: "18px",
          margin: "8px 0 0 0",
          ".MuiInputBase-colorSuccess + &": {
            color: "#18753C"
          },
          ".MuiInputBase-colorError + &, .textarea--error + &": {
            color: "#A02213"
          }
        }
      }
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          textarea: {
            fontFamily: "Inter",
            borderColor: "#E2E6F3",
            borderStyle: "solid",
            borderWidth: "1px",
            borderRadius: 8,
            background: "#FFF",
            color: "#151A47",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "20px",
            padding: 16,
            transition: "border-color 0.3s linear",
            "&:hover": {
              borderColor: "#B5B9D9"
            },
            "&.textarea--filled": {
              borderColor: "#B5B9D9"
            },
            "&:focus": {
              borderColor: "#424880"
            },
            "&.textarea--error": {
              borderColor: "#A02213"
            },
            "&:disabled": {
              pointerEvents: "none",
              color: "#424880",
              background: "#E2E6F3",
              borderColor: "#E2E6F3"
            },
            "&:focus-visible": {
              outline: "none"
            },
            "&::placeholder": {
              fontFamily: "Inter",
              color: "#424880",
              opacity: 1
            },
            "&::-webkit-resizer": {
              background: `no-repeat 100% 100%/150% url(/images/corner-expand.svg)`
            }
          },
          "label + textarea": {
            marginTop: 24
          }
        }
      }
    },
    MuiAlert: {
      styleOverrides: {
        icon: {
          display: "none",
          marginRight: 0
        },
        message: {
          padding: 0,
          fontWeight: 400,
          fontSize: "12px",
          lineHeight: "18px"
        },
        root: {
          padding: 16,
          background: "#F4F7FF",
          border: "1px solid #E2E6F3",
          color: "#424880",
          borderRadius: 8,
          alignItems: "center"
        },
        action: {
          paddingLeft: "10px",
          paddingTop: 0,
          paddingBottom: 0,
          paddingRight: 0
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 8,
          padding: 32,
          width: "600px"
        }
      }
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          background: "rgba(21, 26, 71, 0.6)"
        }
      }
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          "> :not(:first-of-type)": {
            marginLeft: 0
          }
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontSize: "16px",
          lineHeight: "24px",
          fontWeight: "500",
          color: "#424880",
          "&.Mui-selected": { color: "#2C19CD" }
        }
      }
    },
    MuiTabs: {
      styleOverrides: {
        indicator: { backgroundColor: "#2C19CD" }
      }
    }
  }
});

// src/constants/user.ts
var tokenStorageKey = "elasticSuiteToken";

// src/mocks/api.ts
var fieldDropdown = {
  "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
  elasticsuite: {
    input: "dropdown",
    options: {
      values: ["option_test1", "option_test2"]
    },
    editable: false,
    position: 10,
    visible: true
  },
  property: {
    "@id": "https://localhost/docs.jsonld#SourceField/code",
    "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
    domain: { "@id": "https://localhost/docs.jsonld#SourceField" },
    range: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
    label: "Attribute code"
  },
  readable: true,
  required: true,
  title: "code",
  writeable: true
};
var fieldDropdownWithContext = {
  "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
  elasticsuite: {
    input: "dropdown",
    options: {
      values: ["option_test1", "option_test2"]
    },
    editable: false,
    position: 10,
    visible: true,
    context: {
      settings_attribute: {
        visible: true,
        position: 20
      },
      search_configuration_attribute: {
        visible: false,
        position: 30
      }
    }
  },
  property: {
    "@id": "https://localhost/docs.jsonld#SourceField/code",
    "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
    domain: { "@id": "https://localhost/docs.jsonld#SourceField" },
    range: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
    label: "Attribute code"
  },
  readable: true,
  required: true,
  title: "code",
  writeable: true
};
var fieldDropdownWithApiOptions = {
  "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
  elasticsuite: {
    input: "dropdown",
    options: {
      api_rest: "/category_sorting_options"
    },
    editable: false,
    position: 10,
    visible: true
  },
  property: {
    "@id": "https://localhost/docs.jsonld#SourceField/code",
    "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
    domain: { "@id": "https://localhost/docs.jsonld#SourceField" },
    range: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
    label: "Attribute code"
  },
  readable: true,
  required: true,
  title: "code",
  writeable: true
};
var resources = [
  {
    "@id": "https://localhost/docs.jsonld#Index",
    "@type": "http://www.w3.org/ns/hydra/core#Class",
    supportedOperation: [
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/FindAction"
        ],
        method: "GET",
        title: "Retrieves the collection of Index resources.",
        label: "Retrieves the collection of Index resources.",
        returns: { "@id": "http://www.w3.org/ns/hydra/core#Collection" }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/CreateAction"
        ],
        expects: { "@id": "https://localhost/docs.jsonld#Index" },
        method: "POST",
        title: "Creates a Index resource.",
        label: "Creates a Index resource.",
        returns: { "@id": "https://localhost/docs.jsonld#Index" }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/FindAction"
        ],
        method: "GET",
        title: "Retrieves Index resource.",
        label: "Retrieves Index resource.",
        returns: { "@id": "https://localhost/docs.jsonld#Index" }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/DeleteAction"
        ],
        method: "DELETE",
        title: "Deletes the Index resource.",
        label: "Deletes the Index resource.",
        returns: { "@id": "http://www.w3.org/2002/07/owl#Nothing" }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/ReplaceAction"
        ],
        expects: { "@id": "https://localhost/docs.jsonld#Index" },
        method: "PUT",
        title: "Replaces the Index resource.",
        label: "Replaces the Index resource.",
        returns: { "@id": "https://localhost/docs.jsonld#Index" }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/ReplaceAction"
        ],
        expects: { "@id": "https://localhost/docs.jsonld#Index" },
        method: "PUT",
        title: "Replaces the Index resource.",
        label: "Replaces the Index resource.",
        returns: { "@id": "https://localhost/docs.jsonld#Index" }
      }
    ],
    supportedProperty: [
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#Index/name",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: { "@id": "https://localhost/docs.jsonld#Index" },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
          label: "name"
        },
        readable: true,
        required: false,
        title: "name",
        writeable: true
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#Index/aliases",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: { "@id": "https://localhost/docs.jsonld#Index" },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
          label: "aliases"
        },
        readable: true,
        required: false,
        title: "aliases",
        writeable: true
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#Index/docsCount",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: { "@id": "https://localhost/docs.jsonld#Index" },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#integer" },
          label: "docsCount"
        },
        readable: true,
        required: false,
        title: "docsCount",
        writeable: true
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#Index/size",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: { "@id": "https://localhost/docs.jsonld#Index" },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
          label: "size"
        },
        readable: true,
        required: false,
        title: "size",
        writeable: true
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#Index/entityType",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: { "@id": "https://localhost/docs.jsonld#Index" },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
          label: "entityType"
        },
        readable: true,
        required: false,
        title: "entityType",
        writeable: true
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#Index/catalog",
          "@type": "http://www.w3.org/ns/hydra/core#Link",
          domain: { "@id": "https://localhost/docs.jsonld#Index" },
          maxCardinality: 1,
          range: { "@id": "https://localhost/docs.jsonld#LocalizedCatalog" },
          label: "catalog"
        },
        readable: true,
        required: false,
        title: "catalog",
        writeable: true
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#Index/status",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: { "@id": "https://localhost/docs.jsonld#Index" },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
          label: "status"
        },
        readable: true,
        required: false,
        title: "status",
        writeable: true
      }
    ],
    title: "Index",
    label: "Index",
    url: "https://localhost/indices"
  },
  {
    "@id": "https://localhost/docs.jsonld#IndexDocument",
    "@type": "http://www.w3.org/ns/hydra/core#Class",
    supportedOperation: [
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/FindAction"
        ],
        method: "GET",
        title: "Retrieves the collection of IndexDocument resources.",
        label: "Retrieves the collection of IndexDocument resources.",
        returns: { "@id": "http://www.w3.org/ns/hydra/core#Collection" }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/CreateAction"
        ],
        expects: { "@id": "https://localhost/docs.jsonld#IndexDocument" },
        method: "POST",
        title: "Creates a IndexDocument resource.",
        label: "Creates a IndexDocument resource.",
        returns: { "@id": "https://localhost/docs.jsonld#IndexDocument" }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/FindAction"
        ],
        method: "GET",
        title: "Retrieves IndexDocument resource.",
        label: "Retrieves IndexDocument resource.",
        returns: { "@id": "https://localhost/docs.jsonld#IndexDocument" }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/DeleteAction"
        ],
        method: "DELETE",
        title: "Deletes the IndexDocument resource.",
        label: "Deletes the IndexDocument resource.",
        returns: { "@id": "http://www.w3.org/2002/07/owl#Nothing" }
      }
    ],
    supportedProperty: [
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#IndexDocument/indexName",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: { "@id": "https://localhost/docs.jsonld#IndexDocument" },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
          label: "indexName"
        },
        readable: true,
        required: false,
        title: "indexName",
        writeable: true
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#IndexDocument/documents",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: { "@id": "https://localhost/docs.jsonld#IndexDocument" },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
          label: "documents"
        },
        readable: true,
        required: false,
        title: "documents",
        writeable: true
      }
    ],
    title: "IndexDocument",
    label: "IndexDocument",
    url: "https://localhost/index_documents"
  },
  {
    "@id": "https://localhost/docs.jsonld#SourceFieldOption",
    "@type": "http://www.w3.org/ns/hydra/core#Class",
    supportedOperation: [
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/FindAction"
        ],
        method: "GET",
        title: "Retrieves the collection of SourceFieldOption resources.",
        label: "Retrieves the collection of SourceFieldOption resources.",
        returns: { "@id": "http://www.w3.org/ns/hydra/core#Collection" }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/CreateAction"
        ],
        expects: { "@id": "https://localhost/docs.jsonld#SourceFieldOption" },
        method: "POST",
        title: "Creates a SourceFieldOption resource.",
        label: "Creates a SourceFieldOption resource.",
        returns: { "@id": "https://localhost/docs.jsonld#SourceFieldOption" }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/FindAction"
        ],
        method: "GET",
        title: "Retrieves SourceFieldOption resource.",
        label: "Retrieves SourceFieldOption resource.",
        returns: { "@id": "https://localhost/docs.jsonld#SourceFieldOption" }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/ReplaceAction"
        ],
        expects: { "@id": "https://localhost/docs.jsonld#SourceFieldOption" },
        method: "PUT",
        title: "Replaces the SourceFieldOption resource.",
        label: "Replaces the SourceFieldOption resource.",
        returns: { "@id": "https://localhost/docs.jsonld#SourceFieldOption" }
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#Operation",
        expects: { "@id": "https://localhost/docs.jsonld#SourceFieldOption" },
        method: "PATCH",
        title: "Updates the SourceFieldOption resource.",
        label: "Updates the SourceFieldOption resource.",
        returns: { "@id": "https://localhost/docs.jsonld#SourceFieldOption" }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/DeleteAction"
        ],
        method: "DELETE",
        title: "Deletes the SourceFieldOption resource.",
        label: "Deletes the SourceFieldOption resource.",
        returns: { "@id": "http://www.w3.org/2002/07/owl#Nothing" }
      }
    ],
    supportedProperty: [
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#SourceFieldOption/sourceField",
          "@type": "http://www.w3.org/ns/hydra/core#Link",
          domain: { "@id": "https://localhost/docs.jsonld#SourceFieldOption" },
          maxCardinality: 1,
          range: { "@id": "https://localhost/docs.jsonld#SourceField" },
          label: "sourceField"
        },
        readable: true,
        required: true,
        title: "sourceField",
        writeable: true
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#SourceFieldOption/position",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: { "@id": "https://localhost/docs.jsonld#SourceFieldOption" },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#integer" },
          label: "position"
        },
        readable: true,
        required: false,
        title: "position",
        writeable: true
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#SourceFieldOption/labels",
          "@type": "http://www.w3.org/ns/hydra/core#Link",
          domain: { "@id": "https://localhost/docs.jsonld#SourceFieldOption" },
          range: {
            "@id": "https://localhost/docs.jsonld#SourceFieldOptionLabel"
          },
          label: "labels"
        },
        readable: true,
        required: false,
        title: "labels",
        writeable: true
      }
    ],
    title: "SourceFieldOption",
    label: "SourceFieldOption",
    url: "https://localhost/source_field_options"
  },
  {
    "@id": "https://localhost/docs.jsonld#SourceField",
    "@type": "http://www.w3.org/ns/hydra/core#Class",
    supportedOperation: [
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/FindAction"
        ],
        method: "GET",
        title: "Retrieves the collection of SourceField resources.",
        label: "Retrieves the collection of SourceField resources.",
        returns: { "@id": "http://www.w3.org/ns/hydra/core#Collection" }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/CreateAction"
        ],
        expects: { "@id": "https://localhost/docs.jsonld#SourceField" },
        method: "POST",
        title: "Creates a SourceField resource.",
        label: "Creates a SourceField resource.",
        returns: { "@id": "https://localhost/docs.jsonld#SourceField" }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/FindAction"
        ],
        method: "GET",
        title: "Retrieves SourceField resource.",
        label: "Retrieves SourceField resource.",
        returns: { "@id": "https://localhost/docs.jsonld#SourceField" }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/ReplaceAction"
        ],
        expects: { "@id": "https://localhost/docs.jsonld#SourceField" },
        method: "PUT",
        title: "Replaces the SourceField resource.",
        label: "Replaces the SourceField resource.",
        returns: { "@id": "https://localhost/docs.jsonld#SourceField" }
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#Operation",
        expects: { "@id": "https://localhost/docs.jsonld#SourceField" },
        method: "PATCH",
        title: "Updates the SourceField resource.",
        label: "Updates the SourceField resource.",
        returns: { "@id": "https://localhost/docs.jsonld#SourceField" }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/DeleteAction"
        ],
        method: "DELETE",
        title: "Deletes the SourceField resource.",
        label: "Deletes the SourceField resource.",
        returns: { "@id": "http://www.w3.org/2002/07/owl#Nothing" }
      }
    ],
    supportedProperty: [
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        elasticsuite: { editable: false, position: 10, visible: true },
        property: {
          "@id": "https://localhost/docs.jsonld#SourceField/code",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: { "@id": "https://localhost/docs.jsonld#SourceField" },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
          label: "Attribute code"
        },
        readable: true,
        required: true,
        title: "code",
        writeable: true
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        elasticsuite: { editable: false, position: 20, visible: true },
        property: {
          "@id": "https://localhost/docs.jsonld#SourceField/defaultLabel",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: { "@id": "https://localhost/docs.jsonld#SourceField" },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
          label: "Attribute label"
        },
        readable: true,
        required: false,
        title: "defaultLabel",
        writeable: true
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        elasticsuite: {
          context: { grid_2: { visible: false } },
          editable: false,
          position: 30,
          visible: true
        },
        property: {
          "@id": "https://localhost/docs.jsonld#SourceField/type",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: { "@id": "https://localhost/docs.jsonld#SourceField" },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
          label: "Attribute type"
        },
        readable: true,
        required: false,
        title: "type",
        writeable: true
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        elasticsuite: {
          context: { grid_2: { visible: false } },
          editable: true,
          position: 40,
          visible: true
        },
        property: {
          "@id": "https://localhost/docs.jsonld#SourceField/isFilterable",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: { "@id": "https://localhost/docs.jsonld#SourceField" },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#boolean" },
          label: "Filterable"
        },
        readable: true,
        required: false,
        title: "isFilterable",
        writeable: true
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        elasticsuite: {
          context: { grid_2: { visible: false } },
          editable: true,
          position: 50,
          visible: true
        },
        property: {
          "@id": "https://localhost/docs.jsonld#SourceField/isSearchable",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: { "@id": "https://localhost/docs.jsonld#SourceField" },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#boolean" },
          label: "Searchable"
        },
        readable: true,
        required: false,
        title: "isSearchable",
        writeable: true
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        elasticsuite: {
          context: { grid_2: { visible: false } },
          editable: true,
          position: 60,
          visible: true
        },
        property: {
          "@id": "https://localhost/docs.jsonld#SourceField/isSortable",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: { "@id": "https://localhost/docs.jsonld#SourceField" },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#boolean" },
          label: "Sortable"
        },
        readable: true,
        required: false,
        title: "isSortable",
        writeable: true
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        elasticsuite: {
          context: { grid_2: { visible: false } },
          editable: true,
          position: 70,
          visible: true
        },
        property: {
          "@id": "https://localhost/docs.jsonld#SourceField/isUsedForRules",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: { "@id": "https://localhost/docs.jsonld#SourceField" },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#boolean" },
          label: "Use in rule engine"
        },
        readable: true,
        required: false,
        title: "isUsedForRules",
        writeable: true
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        elasticsuite: {
          context: { grid_2: { visible: true } },
          editable: true,
          position: 80,
          visible: false
        },
        property: {
          "@id": "https://localhost/docs.jsonld#SourceField/weight",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: { "@id": "https://localhost/docs.jsonld#SourceField" },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#integer" },
          label: "Search weight"
        },
        readable: true,
        required: false,
        title: "weight",
        writeable: true
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        elasticsuite: {
          context: { grid_2: { visible: true } },
          editable: true,
          position: 90,
          visible: false
        },
        property: {
          "@id": "https://localhost/docs.jsonld#SourceField/isSpellchecked",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: { "@id": "https://localhost/docs.jsonld#SourceField" },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#boolean" },
          label: "Used in spellcheck"
        },
        readable: true,
        required: false,
        title: "isSpellchecked",
        writeable: true
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#SourceField/isSystem",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: { "@id": "https://localhost/docs.jsonld#SourceField" },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#boolean" },
          label: "isSystem"
        },
        readable: true,
        required: false,
        title: "isSystem",
        writeable: true
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#SourceField/metadata",
          "@type": "http://www.w3.org/ns/hydra/core#Link",
          domain: { "@id": "https://localhost/docs.jsonld#SourceField" },
          maxCardinality: 1,
          range: { "@id": "https://localhost/docs.jsonld#Metadata" },
          label: "metadata"
        },
        readable: true,
        required: true,
        title: "metadata",
        writeable: true
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#SourceField/labels",
          "@type": "http://www.w3.org/ns/hydra/core#Link",
          domain: { "@id": "https://localhost/docs.jsonld#SourceField" },
          range: { "@id": "https://localhost/docs.jsonld#SourceFieldLabel" },
          label: "labels"
        },
        readable: true,
        required: false,
        title: "labels",
        writeable: true
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#SourceField/options",
          "@type": "http://www.w3.org/ns/hydra/core#Link",
          domain: { "@id": "https://localhost/docs.jsonld#SourceField" },
          range: { "@id": "https://localhost/docs.jsonld#SourceFieldOption" },
          label: "options"
        },
        readable: true,
        required: false,
        title: "options",
        writeable: true
      }
    ],
    title: "SourceField",
    label: "SourceField",
    url: "https://localhost/source_fields"
  },
  {
    "@id": "https://localhost/docs.jsonld#SourceFieldOptionLabel",
    "@type": "http://www.w3.org/ns/hydra/core#Class",
    supportedOperation: [
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/FindAction"
        ],
        method: "GET",
        title: "Retrieves the collection of SourceFieldOptionLabel resources.",
        label: "Retrieves the collection of SourceFieldOptionLabel resources.",
        returns: { "@id": "http://www.w3.org/ns/hydra/core#Collection" }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/CreateAction"
        ],
        expects: {
          "@id": "https://localhost/docs.jsonld#SourceFieldOptionLabel"
        },
        method: "POST",
        title: "Creates a SourceFieldOptionLabel resource.",
        label: "Creates a SourceFieldOptionLabel resource.",
        returns: {
          "@id": "https://localhost/docs.jsonld#SourceFieldOptionLabel"
        }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/FindAction"
        ],
        method: "GET",
        title: "Retrieves SourceFieldOptionLabel resource.",
        label: "Retrieves SourceFieldOptionLabel resource.",
        returns: {
          "@id": "https://localhost/docs.jsonld#SourceFieldOptionLabel"
        }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/ReplaceAction"
        ],
        expects: {
          "@id": "https://localhost/docs.jsonld#SourceFieldOptionLabel"
        },
        method: "PUT",
        title: "Replaces the SourceFieldOptionLabel resource.",
        label: "Replaces the SourceFieldOptionLabel resource.",
        returns: {
          "@id": "https://localhost/docs.jsonld#SourceFieldOptionLabel"
        }
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#Operation",
        expects: {
          "@id": "https://localhost/docs.jsonld#SourceFieldOptionLabel"
        },
        method: "PATCH",
        title: "Updates the SourceFieldOptionLabel resource.",
        label: "Updates the SourceFieldOptionLabel resource.",
        returns: {
          "@id": "https://localhost/docs.jsonld#SourceFieldOptionLabel"
        }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/DeleteAction"
        ],
        method: "DELETE",
        title: "Deletes the SourceFieldOptionLabel resource.",
        label: "Deletes the SourceFieldOptionLabel resource.",
        returns: { "@id": "http://www.w3.org/2002/07/owl#Nothing" }
      }
    ],
    supportedProperty: [
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#SourceFieldOptionLabel/sourceFieldOption",
          "@type": "http://www.w3.org/ns/hydra/core#Link",
          domain: {
            "@id": "https://localhost/docs.jsonld#SourceFieldOptionLabel"
          },
          maxCardinality: 1,
          range: { "@id": "https://localhost/docs.jsonld#SourceFieldOption" },
          label: "sourceFieldOption"
        },
        readable: true,
        required: true,
        title: "sourceFieldOption",
        writeable: true
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#SourceFieldOptionLabel/catalog",
          "@type": "http://www.w3.org/ns/hydra/core#Link",
          domain: {
            "@id": "https://localhost/docs.jsonld#SourceFieldOptionLabel"
          },
          maxCardinality: 1,
          range: { "@id": "https://localhost/docs.jsonld#LocalizedCatalog" },
          label: "catalog"
        },
        readable: true,
        required: true,
        title: "catalog",
        writeable: true
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#SourceFieldOptionLabel/label",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: {
            "@id": "https://localhost/docs.jsonld#SourceFieldOptionLabel"
          },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
          label: "label"
        },
        readable: true,
        required: true,
        title: "label",
        writeable: true
      }
    ],
    title: "SourceFieldOptionLabel",
    label: "SourceFieldOptionLabel",
    url: "https://localhost/source_field_option_labels"
  },
  {
    "@id": "https://localhost/docs.jsonld#Metadata",
    "@type": "http://www.w3.org/ns/hydra/core#Class",
    supportedOperation: [
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/FindAction"
        ],
        method: "GET",
        title: "Retrieves the collection of Metadata resources.",
        label: "Retrieves the collection of Metadata resources.",
        returns: { "@id": "http://www.w3.org/ns/hydra/core#Collection" }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/CreateAction"
        ],
        expects: { "@id": "https://localhost/docs.jsonld#Metadata" },
        method: "POST",
        title: "Creates a Metadata resource.",
        label: "Creates a Metadata resource.",
        returns: { "@id": "https://localhost/docs.jsonld#Metadata" }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/FindAction"
        ],
        method: "GET",
        title: "Retrieves Metadata resource.",
        label: "Retrieves Metadata resource.",
        returns: { "@id": "https://localhost/docs.jsonld#Metadata" }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/ReplaceAction"
        ],
        expects: { "@id": "https://localhost/docs.jsonld#Metadata" },
        method: "PUT",
        title: "Replaces the Metadata resource.",
        label: "Replaces the Metadata resource.",
        returns: { "@id": "https://localhost/docs.jsonld#Metadata" }
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#Operation",
        expects: { "@id": "https://localhost/docs.jsonld#Metadata" },
        method: "PATCH",
        title: "Updates the Metadata resource.",
        label: "Updates the Metadata resource.",
        returns: { "@id": "https://localhost/docs.jsonld#Metadata" }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/DeleteAction"
        ],
        method: "DELETE",
        title: "Deletes the Metadata resource.",
        label: "Deletes the Metadata resource.",
        returns: { "@id": "http://www.w3.org/2002/07/owl#Nothing" }
      }
    ],
    supportedProperty: [
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#Metadata/entity",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: { "@id": "https://localhost/docs.jsonld#Metadata" },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
          label: "entity"
        },
        readable: true,
        required: true,
        title: "entity",
        writeable: true
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#Metadata/sourceFields",
          "@type": "http://www.w3.org/ns/hydra/core#Link",
          domain: { "@id": "https://localhost/docs.jsonld#Metadata" },
          range: { "@id": "https://localhost/docs.jsonld#SourceField" },
          label: "sourceFields"
        },
        readable: true,
        required: false,
        title: "sourceFields",
        writeable: true
      }
    ],
    title: "Metadata",
    label: "Metadata",
    url: "https://localhost/metadata"
  },
  {
    "@id": "https://localhost/docs.jsonld#SourceFieldLabel",
    "@type": "http://www.w3.org/ns/hydra/core#Class",
    supportedOperation: [
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/FindAction"
        ],
        method: "GET",
        title: "Retrieves the collection of SourceFieldLabel resources.",
        label: "Retrieves the collection of SourceFieldLabel resources.",
        returns: { "@id": "http://www.w3.org/ns/hydra/core#Collection" }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/CreateAction"
        ],
        expects: { "@id": "https://localhost/docs.jsonld#SourceFieldLabel" },
        method: "POST",
        title: "Creates a SourceFieldLabel resource.",
        label: "Creates a SourceFieldLabel resource.",
        returns: { "@id": "https://localhost/docs.jsonld#SourceFieldLabel" }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/FindAction"
        ],
        method: "GET",
        title: "Retrieves SourceFieldLabel resource.",
        label: "Retrieves SourceFieldLabel resource.",
        returns: { "@id": "https://localhost/docs.jsonld#SourceFieldLabel" }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/ReplaceAction"
        ],
        expects: { "@id": "https://localhost/docs.jsonld#SourceFieldLabel" },
        method: "PUT",
        title: "Replaces the SourceFieldLabel resource.",
        label: "Replaces the SourceFieldLabel resource.",
        returns: { "@id": "https://localhost/docs.jsonld#SourceFieldLabel" }
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#Operation",
        expects: { "@id": "https://localhost/docs.jsonld#SourceFieldLabel" },
        method: "PATCH",
        title: "Updates the SourceFieldLabel resource.",
        label: "Updates the SourceFieldLabel resource.",
        returns: { "@id": "https://localhost/docs.jsonld#SourceFieldLabel" }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/DeleteAction"
        ],
        method: "DELETE",
        title: "Deletes the SourceFieldLabel resource.",
        label: "Deletes the SourceFieldLabel resource.",
        returns: { "@id": "http://www.w3.org/2002/07/owl#Nothing" }
      }
    ],
    supportedProperty: [
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#SourceFieldLabel/sourceField",
          "@type": "http://www.w3.org/ns/hydra/core#Link",
          domain: { "@id": "https://localhost/docs.jsonld#SourceFieldLabel" },
          maxCardinality: 1,
          range: { "@id": "https://localhost/docs.jsonld#SourceField" },
          label: "sourceField"
        },
        readable: true,
        required: true,
        title: "sourceField",
        writeable: true
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#SourceFieldLabel/catalog",
          "@type": "http://www.w3.org/ns/hydra/core#Link",
          domain: { "@id": "https://localhost/docs.jsonld#SourceFieldLabel" },
          maxCardinality: 1,
          range: { "@id": "https://localhost/docs.jsonld#LocalizedCatalog" },
          label: "catalog"
        },
        readable: true,
        required: true,
        title: "catalog",
        writeable: true
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#SourceFieldLabel/label",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: { "@id": "https://localhost/docs.jsonld#SourceFieldLabel" },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
          label: "label"
        },
        readable: true,
        required: true,
        title: "label",
        writeable: true
      }
    ],
    title: "SourceFieldLabel",
    label: "SourceFieldLabel",
    url: "https://localhost/source_field_labels"
  },
  {
    "@id": "https://localhost/docs.jsonld#Catalog",
    "@type": "http://www.w3.org/ns/hydra/core#Class",
    supportedOperation: [
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/FindAction"
        ],
        method: "GET",
        title: "Retrieves the collection of Catalog resources.",
        label: "Retrieves the collection of Catalog resources.",
        returns: { "@id": "http://www.w3.org/ns/hydra/core#Collection" }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/CreateAction"
        ],
        expects: { "@id": "https://localhost/docs.jsonld#Catalog" },
        method: "POST",
        title: "Creates a Catalog resource.",
        label: "Creates a Catalog resource.",
        returns: { "@id": "https://localhost/docs.jsonld#Catalog" }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/FindAction"
        ],
        method: "GET",
        title: "Retrieves Catalog resource.",
        label: "Retrieves Catalog resource.",
        returns: { "@id": "https://localhost/docs.jsonld#Catalog" }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/ReplaceAction"
        ],
        expects: { "@id": "https://localhost/docs.jsonld#Catalog" },
        method: "PUT",
        title: "Replaces the Catalog resource.",
        label: "Replaces the Catalog resource.",
        returns: { "@id": "https://localhost/docs.jsonld#Catalog" }
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#Operation",
        expects: { "@id": "https://localhost/docs.jsonld#Catalog" },
        method: "PATCH",
        title: "Updates the Catalog resource.",
        label: "Updates the Catalog resource.",
        returns: { "@id": "https://localhost/docs.jsonld#Catalog" }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/DeleteAction"
        ],
        method: "DELETE",
        title: "Deletes the Catalog resource.",
        label: "Deletes the Catalog resource.",
        returns: { "@id": "http://www.w3.org/2002/07/owl#Nothing" }
      }
    ],
    supportedProperty: [
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#Catalog/code",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: { "@id": "https://localhost/docs.jsonld#Catalog" },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
          label: "code"
        },
        readable: true,
        required: true,
        title: "code",
        writeable: true
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#Catalog/name",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: { "@id": "https://localhost/docs.jsonld#Catalog" },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
          label: "name"
        },
        readable: true,
        required: false,
        title: "name",
        writeable: true
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#Catalog/localizedCatalogs",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: { "@id": "https://localhost/docs.jsonld#Catalog" },
          range: { "@id": "https://localhost/docs.jsonld#LocalizedCatalog" },
          label: "localizedCatalogs"
        },
        readable: true,
        required: false,
        title: "localizedCatalogs",
        writeable: true
      }
    ],
    title: "Catalog",
    label: "Catalog",
    url: "https://localhost/catalogs"
  },
  {
    "@id": "https://localhost/docs.jsonld#LocalizedCatalog",
    "@type": "http://www.w3.org/ns/hydra/core#Class",
    supportedOperation: [
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/FindAction"
        ],
        method: "GET",
        title: "Retrieves the collection of LocalizedCatalog resources.",
        label: "Retrieves the collection of LocalizedCatalog resources.",
        returns: { "@id": "http://www.w3.org/ns/hydra/core#Collection" }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/CreateAction"
        ],
        expects: { "@id": "https://localhost/docs.jsonld#LocalizedCatalog" },
        method: "POST",
        title: "Creates a LocalizedCatalog resource.",
        label: "Creates a LocalizedCatalog resource.",
        returns: { "@id": "https://localhost/docs.jsonld#LocalizedCatalog" }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/FindAction"
        ],
        method: "GET",
        title: "Retrieves LocalizedCatalog resource.",
        label: "Retrieves LocalizedCatalog resource.",
        returns: { "@id": "https://localhost/docs.jsonld#LocalizedCatalog" }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/ReplaceAction"
        ],
        expects: { "@id": "https://localhost/docs.jsonld#LocalizedCatalog" },
        method: "PUT",
        title: "Replaces the LocalizedCatalog resource.",
        label: "Replaces the LocalizedCatalog resource.",
        returns: { "@id": "https://localhost/docs.jsonld#LocalizedCatalog" }
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#Operation",
        expects: { "@id": "https://localhost/docs.jsonld#LocalizedCatalog" },
        method: "PATCH",
        title: "Updates the LocalizedCatalog resource.",
        label: "Updates the LocalizedCatalog resource.",
        returns: { "@id": "https://localhost/docs.jsonld#LocalizedCatalog" }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/DeleteAction"
        ],
        method: "DELETE",
        title: "Deletes the LocalizedCatalog resource.",
        label: "Deletes the LocalizedCatalog resource.",
        returns: { "@id": "http://www.w3.org/2002/07/owl#Nothing" }
      }
    ],
    supportedProperty: [
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#LocalizedCatalog/name",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: { "@id": "https://localhost/docs.jsonld#LocalizedCatalog" },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
          label: "name"
        },
        readable: true,
        required: false,
        title: "name",
        writeable: true
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#LocalizedCatalog/code",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: { "@id": "https://localhost/docs.jsonld#LocalizedCatalog" },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
          label: "code"
        },
        readable: true,
        required: true,
        title: "code",
        writeable: true
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#LocalizedCatalog/locale",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: { "@id": "https://localhost/docs.jsonld#LocalizedCatalog" },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
          label: "locale"
        },
        readable: true,
        required: true,
        title: "locale",
        writeable: true
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        description: "It's important to keep the getter for isDefault property,\notherwise Api Platform will be not able to get the value in the response,\nin other words don't rename by IsDefault().",
        property: {
          "@id": "https://localhost/docs.jsonld#LocalizedCatalog/isDefault",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: { "@id": "https://localhost/docs.jsonld#LocalizedCatalog" },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#boolean" },
          label: "isDefault"
        },
        readable: true,
        required: false,
        title: "isDefault",
        writeable: true
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#LocalizedCatalog/catalog",
          "@type": "http://www.w3.org/ns/hydra/core#Link",
          domain: { "@id": "https://localhost/docs.jsonld#LocalizedCatalog" },
          maxCardinality: 1,
          range: { "@id": "https://localhost/docs.jsonld#Catalog" },
          label: "catalog"
        },
        readable: true,
        required: true,
        title: "catalog",
        writeable: true
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#LocalizedCatalog/localName",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: { "@id": "https://localhost/docs.jsonld#LocalizedCatalog" },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
          label: "localName"
        },
        readable: true,
        required: false,
        title: "localName",
        writeable: false
      }
    ],
    title: "LocalizedCatalog",
    label: "LocalizedCatalog",
    url: "https://localhost/localized_catalogs"
  },
  {
    "@id": "https://localhost/docs.jsonld#FacetConfiguration",
    "@type": "http://www.w3.org/ns/hydra/core#Class",
    supportedOperation: [
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/FindAction"
        ],
        method: "GET",
        title: "Retrieves the collection of FacetConfiguration resources.",
        label: "Retrieves the collection of FacetConfiguration resources.",
        returns: { "@id": "http://www.w3.org/ns/hydra/core#Collection" }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/FindAction"
        ],
        method: "GET",
        title: "Retrieves FacetConfiguration resource.",
        label: "Retrieves FacetConfiguration resource.",
        returns: { "@id": "https://localhost/docs.jsonld#FacetConfiguration" }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/ReplaceAction"
        ],
        expects: { "@id": "https://localhost/docs.jsonld#FacetConfiguration" },
        method: "PUT",
        title: "Replaces the FacetConfiguration resource.",
        label: "Replaces the FacetConfiguration resource.",
        returns: { "@id": "https://localhost/docs.jsonld#FacetConfiguration" }
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#Operation",
        expects: { "@id": "https://localhost/docs.jsonld#FacetConfiguration" },
        method: "PATCH",
        title: "Updates the FacetConfiguration resource.",
        label: "Updates the FacetConfiguration resource.",
        returns: { "@id": "https://localhost/docs.jsonld#FacetConfiguration" }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/DeleteAction"
        ],
        method: "DELETE",
        title: "Deletes the FacetConfiguration resource.",
        label: "Deletes the FacetConfiguration resource.",
        returns: { "@id": "http://www.w3.org/2002/07/owl#Nothing" }
      }
    ],
    supportedProperty: [
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#FacetConfiguration/sourceField",
          "@type": "http://www.w3.org/ns/hydra/core#Link",
          domain: { "@id": "https://localhost/docs.jsonld#FacetConfiguration" },
          maxCardinality: 1,
          range: { "@id": "https://localhost/docs.jsonld#SourceField" },
          label: "sourceField"
        },
        readable: true,
        required: true,
        title: "sourceField",
        writeable: true
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#FacetConfiguration/category",
          "@type": "http://www.w3.org/ns/hydra/core#Link",
          domain: { "@id": "https://localhost/docs.jsonld#FacetConfiguration" },
          maxCardinality: 1,
          range: { "@id": "https://localhost/docs.jsonld#Category" },
          label: "category"
        },
        readable: true,
        required: false,
        title: "category",
        writeable: true
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#FacetConfiguration/displayMode",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: { "@id": "https://localhost/docs.jsonld#FacetConfiguration" },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
          label: "displayMode"
        },
        readable: true,
        required: false,
        title: "displayMode",
        writeable: true
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#FacetConfiguration/coverageRate",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: { "@id": "https://localhost/docs.jsonld#FacetConfiguration" },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#integer" },
          label: "coverageRate"
        },
        readable: true,
        required: false,
        title: "coverageRate",
        writeable: true
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#FacetConfiguration/maxSize",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: { "@id": "https://localhost/docs.jsonld#FacetConfiguration" },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#integer" },
          label: "maxSize"
        },
        readable: true,
        required: false,
        title: "maxSize",
        writeable: true
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#FacetConfiguration/sortOrder",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: { "@id": "https://localhost/docs.jsonld#FacetConfiguration" },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
          label: "sortOrder"
        },
        readable: true,
        required: false,
        title: "sortOrder",
        writeable: true
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#FacetConfiguration/isRecommendable",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: { "@id": "https://localhost/docs.jsonld#FacetConfiguration" },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#boolean" },
          label: "isRecommendable"
        },
        readable: true,
        required: false,
        title: "isRecommendable",
        writeable: true
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#FacetConfiguration/isVirtual",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: { "@id": "https://localhost/docs.jsonld#FacetConfiguration" },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#boolean" },
          label: "isVirtual"
        },
        readable: true,
        required: false,
        title: "isVirtual",
        writeable: true
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#FacetConfiguration/defaultDisplayMode",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: { "@id": "https://localhost/docs.jsonld#FacetConfiguration" },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
          label: "defaultDisplayMode"
        },
        readable: true,
        required: false,
        title: "defaultDisplayMode",
        writeable: false
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#FacetConfiguration/defaultCoverageRate",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: { "@id": "https://localhost/docs.jsonld#FacetConfiguration" },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#integer" },
          label: "defaultCoverageRate"
        },
        readable: true,
        required: false,
        title: "defaultCoverageRate",
        writeable: false
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#FacetConfiguration/defaultMaxSize",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: { "@id": "https://localhost/docs.jsonld#FacetConfiguration" },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#integer" },
          label: "defaultMaxSize"
        },
        readable: true,
        required: false,
        title: "defaultMaxSize",
        writeable: false
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#FacetConfiguration/defaultSortOrder",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: { "@id": "https://localhost/docs.jsonld#FacetConfiguration" },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
          label: "defaultSortOrder"
        },
        readable: true,
        required: false,
        title: "defaultSortOrder",
        writeable: false
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#FacetConfiguration/defaultIsRecommendable",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: { "@id": "https://localhost/docs.jsonld#FacetConfiguration" },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#boolean" },
          label: "defaultIsRecommendable"
        },
        readable: true,
        required: false,
        title: "defaultIsRecommendable",
        writeable: false
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#FacetConfiguration/defaultIsVirtual",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: { "@id": "https://localhost/docs.jsonld#FacetConfiguration" },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#boolean" },
          label: "defaultIsVirtual"
        },
        readable: true,
        required: false,
        title: "defaultIsVirtual",
        writeable: false
      }
    ],
    title: "FacetConfiguration",
    label: "FacetConfiguration",
    url: "https://localhost/facet_configurations"
  },
  {
    "@id": "https://localhost/docs.jsonld#Category",
    "@type": "http://www.w3.org/ns/hydra/core#Class",
    supportedOperation: [
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/FindAction"
        ],
        method: "GET",
        title: "Retrieves the collection of Category resources.",
        label: "Retrieves the collection of Category resources.",
        returns: { "@id": "http://www.w3.org/ns/hydra/core#Collection" }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/CreateAction"
        ],
        expects: { "@id": "https://localhost/docs.jsonld#Category" },
        method: "POST",
        title: "Creates a Category resource.",
        label: "Creates a Category resource.",
        returns: { "@id": "https://localhost/docs.jsonld#Category" }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/FindAction"
        ],
        method: "GET",
        title: "Retrieves Category resource.",
        label: "Retrieves Category resource.",
        returns: { "@id": "https://localhost/docs.jsonld#Category" }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/ReplaceAction"
        ],
        expects: { "@id": "https://localhost/docs.jsonld#Category" },
        method: "PUT",
        title: "Replaces the Category resource.",
        label: "Replaces the Category resource.",
        returns: { "@id": "https://localhost/docs.jsonld#Category" }
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#Operation",
        expects: { "@id": "https://localhost/docs.jsonld#Category" },
        method: "PATCH",
        title: "Updates the Category resource.",
        label: "Updates the Category resource.",
        returns: { "@id": "https://localhost/docs.jsonld#Category" }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/DeleteAction"
        ],
        method: "DELETE",
        title: "Deletes the Category resource.",
        label: "Deletes the Category resource.",
        returns: { "@id": "http://www.w3.org/2002/07/owl#Nothing" }
      }
    ],
    supportedProperty: [
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#Category/id",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: { "@id": "https://localhost/docs.jsonld#Category" },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
          label: "id"
        },
        readable: true,
        required: false,
        title: "id",
        writeable: true
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#Category/parentId",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: { "@id": "https://localhost/docs.jsonld#Category" },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
          label: "parentId"
        },
        readable: true,
        required: false,
        title: "parentId",
        writeable: true
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#Category/level",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: { "@id": "https://localhost/docs.jsonld#Category" },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#integer" },
          label: "level"
        },
        readable: true,
        required: false,
        title: "level",
        writeable: true
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#Category/path",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: { "@id": "https://localhost/docs.jsonld#Category" },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
          label: "path"
        },
        readable: true,
        required: false,
        title: "path",
        writeable: true
      }
    ],
    title: "Category",
    label: "Category",
    url: "https://localhost/categories"
  },
  {
    "@id": "https://localhost/docs.jsonld#CategorySortingOption",
    "@type": "http://www.w3.org/ns/hydra/core#Class",
    supportedOperation: {
      "@type": [
        "http://www.w3.org/ns/hydra/core#Operation",
        "http://schema.org/FindAction"
      ],
      method: "GET",
      title: "Retrieves the collection of CategorySortingOption resources.",
      label: "Retrieves the collection of CategorySortingOption resources.",
      returns: { "@id": "http://www.w3.org/ns/hydra/core#Collection" }
    },
    supportedProperty: [
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#CategorySortingOption/label",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: {
            "@id": "https://localhost/docs.jsonld#CategorySortingOption"
          },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
          label: "label"
        },
        readable: true,
        required: false,
        title: "label",
        writeable: true
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#CategorySortingOption/code",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: {
            "@id": "https://localhost/docs.jsonld#CategorySortingOption"
          },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
          label: "code"
        },
        readable: true,
        required: false,
        title: "code",
        writeable: true
      }
    ],
    title: "CategorySortingOption",
    label: "CategorySortingOption",
    url: "https://localhost/category_sorting_options"
  },
  {
    "@id": "https://localhost/docs.jsonld#CategoryConfiguration",
    "@type": "http://www.w3.org/ns/hydra/core#Class",
    supportedOperation: [
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/FindAction"
        ],
        method: "GET",
        title: "Retrieves the collection of CategoryConfiguration resources.",
        label: "Retrieves the collection of CategoryConfiguration resources.",
        returns: { "@id": "http://www.w3.org/ns/hydra/core#Collection" }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/CreateAction"
        ],
        expects: {
          "@id": "https://localhost/docs.jsonld#CategoryConfiguration"
        },
        method: "POST",
        title: "Creates a CategoryConfiguration resource.",
        label: "Creates a CategoryConfiguration resource.",
        returns: {
          "@id": "https://localhost/docs.jsonld#CategoryConfiguration"
        }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/FindAction"
        ],
        method: "GET",
        title: "Retrieves CategoryConfiguration resource.",
        label: "Retrieves CategoryConfiguration resource.",
        returns: {
          "@id": "https://localhost/docs.jsonld#CategoryConfiguration"
        }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/FindAction"
        ],
        method: "GET",
        title: "Retrieves CategoryConfiguration resource.",
        label: "Retrieves CategoryConfiguration resource.",
        returns: {
          "@id": "https://localhost/docs.jsonld#CategoryConfiguration"
        }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/ReplaceAction"
        ],
        expects: {
          "@id": "https://localhost/docs.jsonld#CategoryConfiguration"
        },
        method: "PUT",
        title: "Replaces the CategoryConfiguration resource.",
        label: "Replaces the CategoryConfiguration resource.",
        returns: {
          "@id": "https://localhost/docs.jsonld#CategoryConfiguration"
        }
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#Operation",
        expects: {
          "@id": "https://localhost/docs.jsonld#CategoryConfiguration"
        },
        method: "PATCH",
        title: "Updates the CategoryConfiguration resource.",
        label: "Updates the CategoryConfiguration resource.",
        returns: {
          "@id": "https://localhost/docs.jsonld#CategoryConfiguration"
        }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/DeleteAction"
        ],
        method: "DELETE",
        title: "Deletes the CategoryConfiguration resource.",
        label: "Deletes the CategoryConfiguration resource.",
        returns: { "@id": "http://www.w3.org/2002/07/owl#Nothing" }
      }
    ],
    supportedProperty: [
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#CategoryConfiguration/category",
          "@type": "http://www.w3.org/ns/hydra/core#Link",
          domain: {
            "@id": "https://localhost/docs.jsonld#CategoryConfiguration"
          },
          maxCardinality: 1,
          range: { "@id": "https://localhost/docs.jsonld#Category" },
          label: "category"
        },
        readable: true,
        required: false,
        title: "category",
        writeable: true
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#CategoryConfiguration/catalog",
          "@type": "http://www.w3.org/ns/hydra/core#Link",
          domain: {
            "@id": "https://localhost/docs.jsonld#CategoryConfiguration"
          },
          maxCardinality: 1,
          range: { "@id": "https://localhost/docs.jsonld#Catalog" },
          label: "catalog"
        },
        readable: true,
        required: false,
        title: "catalog",
        writeable: true
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#CategoryConfiguration/localizedCatalog",
          "@type": "http://www.w3.org/ns/hydra/core#Link",
          domain: {
            "@id": "https://localhost/docs.jsonld#CategoryConfiguration"
          },
          maxCardinality: 1,
          range: { "@id": "https://localhost/docs.jsonld#LocalizedCatalog" },
          label: "localizedCatalog"
        },
        readable: true,
        required: false,
        title: "localizedCatalog",
        writeable: true
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#CategoryConfiguration/name",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: {
            "@id": "https://localhost/docs.jsonld#CategoryConfiguration"
          },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
          label: "name"
        },
        readable: true,
        required: false,
        title: "name",
        writeable: true
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#CategoryConfiguration/isVirtual",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: {
            "@id": "https://localhost/docs.jsonld#CategoryConfiguration"
          },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#boolean" },
          label: "isVirtual"
        },
        readable: true,
        required: false,
        title: "isVirtual",
        writeable: true
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#CategoryConfiguration/useNameInProductSearch",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: {
            "@id": "https://localhost/docs.jsonld#CategoryConfiguration"
          },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#boolean" },
          label: "useNameInProductSearch"
        },
        readable: true,
        required: false,
        title: "useNameInProductSearch",
        writeable: true
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#CategoryConfiguration/defaultSorting",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: {
            "@id": "https://localhost/docs.jsonld#CategoryConfiguration"
          },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
          label: "defaultSorting"
        },
        readable: true,
        required: false,
        title: "defaultSorting",
        writeable: true
      }
    ],
    title: "CategoryConfiguration",
    label: "CategoryConfiguration",
    url: "https://localhost/category_configurations"
  },
  {
    "@id": "https://localhost/docs.jsonld#ExampleDocument",
    "@type": "http://www.w3.org/ns/hydra/core#Class",
    supportedOperation: [
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/FindAction"
        ],
        method: "GET",
        title: "Retrieves the collection of ExampleDocument resources.",
        label: "Retrieves the collection of ExampleDocument resources.",
        returns: { "@id": "http://www.w3.org/ns/hydra/core#Collection" }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/CreateAction"
        ],
        expects: { "@id": "https://localhost/docs.jsonld#ExampleDocument" },
        method: "POST",
        title: "Creates a ExampleDocument resource.",
        label: "Creates a ExampleDocument resource.",
        returns: { "@id": "https://localhost/docs.jsonld#ExampleDocument" }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/FindAction"
        ],
        method: "GET",
        title: "Retrieves ExampleDocument resource.",
        label: "Retrieves ExampleDocument resource.",
        returns: { "@id": "https://localhost/docs.jsonld#ExampleDocument" }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/DeleteAction"
        ],
        method: "DELETE",
        title: "Deletes the ExampleDocument resource.",
        label: "Deletes the ExampleDocument resource.",
        returns: { "@id": "http://www.w3.org/2002/07/owl#Nothing" }
      }
    ],
    supportedProperty: [
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#ExampleDocument/indexName",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: { "@id": "https://localhost/docs.jsonld#ExampleDocument" },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
          label: "indexName"
        },
        readable: true,
        required: false,
        title: "indexName",
        writeable: true
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#ExampleDocument/documents",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: { "@id": "https://localhost/docs.jsonld#ExampleDocument" },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
          label: "documents"
        },
        readable: true,
        required: false,
        title: "documents",
        writeable: true
      }
    ],
    title: "ExampleDocument",
    label: "ExampleDocument",
    url: "https://localhost/example_documents"
  },
  {
    "@id": "https://localhost/docs.jsonld#ExampleProduct",
    "@type": "http://www.w3.org/ns/hydra/core#Class",
    supportedOperation: [
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/FindAction"
        ],
        method: "GET",
        title: "Retrieves the collection of ExampleProduct resources.",
        label: "Retrieves the collection of ExampleProduct resources.",
        returns: { "@id": "http://www.w3.org/ns/hydra/core#Collection" }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/FindAction"
        ],
        method: "GET",
        title: "Retrieves ExampleProduct resource.",
        label: "Retrieves ExampleProduct resource.",
        returns: { "@id": "https://localhost/docs.jsonld#ExampleProduct" }
      }
    ],
    supportedProperty: [
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#ExampleProduct/entity_id",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: { "@id": "https://localhost/docs.jsonld#ExampleProduct" },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
          label: "entity_id"
        },
        readable: true,
        required: false,
        title: "entity_id",
        writeable: true
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        description: "description",
        property: {
          "@id": "https://localhost/docs.jsonld#ExampleProduct/description",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: { "@id": "https://localhost/docs.jsonld#ExampleProduct" },
          label: "description"
        },
        readable: true,
        required: false,
        title: "description",
        writeable: true
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#ExampleProduct/type_id",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: { "@id": "https://localhost/docs.jsonld#ExampleProduct" },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
          label: "type_id"
        },
        readable: true,
        required: false,
        title: "type_id",
        writeable: true
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#ExampleProduct/created_at",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: { "@id": "https://localhost/docs.jsonld#ExampleProduct" },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
          label: "created_at"
        },
        readable: true,
        required: false,
        title: "created_at",
        writeable: true
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#ExampleProduct/updated_at",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: { "@id": "https://localhost/docs.jsonld#ExampleProduct" },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
          label: "updated_at"
        },
        readable: true,
        required: false,
        title: "updated_at",
        writeable: true
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#ExampleProduct/attributes",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: { "@id": "https://localhost/docs.jsonld#ExampleProduct" },
          label: "attributes"
        },
        readable: true,
        required: false,
        title: "attributes",
        writeable: true
      }
    ],
    title: "ExampleProduct",
    label: "ExampleProduct",
    url: "https://localhost/example_products"
  },
  {
    "@id": "https://localhost/docs.jsonld#ExampleCategory",
    "@type": "http://www.w3.org/ns/hydra/core#Class",
    supportedOperation: [
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/FindAction"
        ],
        method: "GET",
        title: "Retrieves the collection of ExampleCategory resources.",
        label: "Retrieves the collection of ExampleCategory resources.",
        returns: { "@id": "http://www.w3.org/ns/hydra/core#Collection" }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/CreateAction"
        ],
        expects: { "@id": "https://localhost/docs.jsonld#ExampleCategory" },
        method: "POST",
        title: "Creates a ExampleCategory resource.",
        label: "Creates a ExampleCategory resource.",
        returns: { "@id": "https://localhost/docs.jsonld#ExampleCategory" }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/FindAction"
        ],
        method: "GET",
        title: "Retrieves ExampleCategory resource.",
        label: "Retrieves ExampleCategory resource.",
        returns: { "@id": "https://localhost/docs.jsonld#ExampleCategory" }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/ReplaceAction"
        ],
        expects: { "@id": "https://localhost/docs.jsonld#ExampleCategory" },
        method: "PUT",
        title: "Replaces the ExampleCategory resource.",
        label: "Replaces the ExampleCategory resource.",
        returns: { "@id": "https://localhost/docs.jsonld#ExampleCategory" }
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#Operation",
        expects: { "@id": "https://localhost/docs.jsonld#ExampleCategory" },
        method: "PATCH",
        title: "Updates the ExampleCategory resource.",
        label: "Updates the ExampleCategory resource.",
        returns: { "@id": "https://localhost/docs.jsonld#ExampleCategory" }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/DeleteAction"
        ],
        method: "DELETE",
        title: "Deletes the ExampleCategory resource.",
        label: "Deletes the ExampleCategory resource.",
        returns: { "@id": "http://www.w3.org/2002/07/owl#Nothing" }
      }
    ],
    supportedProperty: [
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#ExampleCategory/name",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: { "@id": "https://localhost/docs.jsonld#ExampleCategory" },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
          label: "name"
        },
        readable: true,
        required: false,
        title: "name",
        writeable: true
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#ExampleCategory/description",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: { "@id": "https://localhost/docs.jsonld#ExampleCategory" },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
          label: "description"
        },
        readable: true,
        required: false,
        title: "description",
        writeable: true
      }
    ],
    title: "ExampleCategory",
    label: "ExampleCategory",
    url: "https://localhost/example_categories"
  },
  {
    "@id": "https://localhost/docs.jsonld#ExampleIndex",
    "@type": "http://www.w3.org/ns/hydra/core#Class",
    supportedOperation: [
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/FindAction"
        ],
        method: "GET",
        title: "Retrieves the collection of ExampleIndex resources.",
        label: "Retrieves the collection of ExampleIndex resources.",
        returns: { "@id": "http://www.w3.org/ns/hydra/core#Collection" }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/CreateAction"
        ],
        expects: { "@id": "https://localhost/docs.jsonld#ExampleIndex" },
        method: "POST",
        title: "Creates a ExampleIndex resource.",
        label: "Creates a ExampleIndex resource.",
        returns: { "@id": "https://localhost/docs.jsonld#ExampleIndex" }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/FindAction"
        ],
        method: "GET",
        title: "Retrieves ExampleIndex resource.",
        label: "Retrieves ExampleIndex resource.",
        returns: { "@id": "https://localhost/docs.jsonld#ExampleIndex" }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/DeleteAction"
        ],
        method: "DELETE",
        title: "Deletes the ExampleIndex resource.",
        label: "Deletes the ExampleIndex resource.",
        returns: { "@id": "http://www.w3.org/2002/07/owl#Nothing" }
      }
    ],
    supportedProperty: [
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        property: {
          "@id": "https://localhost/docs.jsonld#ExampleIndex/name",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: { "@id": "https://localhost/docs.jsonld#ExampleIndex" },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
          label: "name"
        },
        readable: true,
        required: false,
        title: "name",
        writeable: true
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
        description: "health",
        property: {
          "@id": "https://localhost/docs.jsonld#ExampleIndex/health",
          "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
          domain: { "@id": "https://localhost/docs.jsonld#ExampleIndex" },
          range: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
          label: "health"
        },
        readable: true,
        required: false,
        title: "health",
        writeable: true
      }
    ],
    title: "ExampleIndex",
    label: "ExampleIndex",
    url: "https://localhost/example_indices"
  },
  {
    "@id": "https://localhost/Declarative Greeting",
    "@type": "http://www.w3.org/ns/hydra/core#Class",
    description: "Description of declarative greetings (description)",
    supportedOperation: [
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/FindAction"
        ],
        method: "GET",
        title: "Retrieves the collection of DeclarativeGreeting resources.",
        label: "Retrieves the collection of DeclarativeGreeting resources.",
        returns: { "@id": "http://www.w3.org/ns/hydra/core#Collection" }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/CreateAction"
        ],
        expects: { "@id": "https://localhost/Declarative Greeting" },
        method: "POST",
        title: "Creates a DeclarativeGreeting resource.",
        label: "Creates a DeclarativeGreeting resource.",
        returns: { "@id": "https://localhost/Declarative Greeting" }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/FindAction"
        ],
        method: "GET",
        title: "Retrieves DeclarativeGreeting resource.",
        label: "Retrieves DeclarativeGreeting resource.",
        returns: { "@id": "https://localhost/Declarative Greeting" }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/DeleteAction"
        ],
        method: "DELETE",
        title: "Deletes the DeclarativeGreeting resource.",
        label: "Deletes the DeclarativeGreeting resource.",
        returns: { "@id": "http://www.w3.org/2002/07/owl#Nothing" }
      },
      {
        "@type": [
          "http://www.w3.org/ns/hydra/core#Operation",
          "http://schema.org/ReplaceAction"
        ],
        expects: { "@id": "https://localhost/Declarative Greeting" },
        method: "PUT",
        title: "Replaces the DeclarativeGreeting resource.",
        label: "Replaces the DeclarativeGreeting resource.",
        returns: { "@id": "https://localhost/Declarative Greeting" }
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#Operation",
        expects: { "@id": "https://localhost/Declarative Greeting" },
        method: "PATCH",
        title: "Updates the DeclarativeGreeting resource.",
        label: "Updates the DeclarativeGreeting resource.",
        returns: { "@id": "https://localhost/Declarative Greeting" }
      }
    ],
    supportedProperty: {
      "@type": "http://www.w3.org/ns/hydra/core#SupportedProperty",
      description: "A nice person.",
      property: {
        "@id": "https://localhost/docs.jsonld#DeclarativeGreeting/name",
        "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
        domain: { "@id": "https://localhost/Declarative Greeting" },
        range: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
        label: "name"
      },
      readable: true,
      required: true,
      title: "name",
      writeable: true
    },
    title: "DeclarativeGreeting",
    label: "DeclarativeGreeting",
    url: "https://localhost/declarative_greetings"
  }
];
var [, , , resourceWithRef, , resource] = resources;
var [fieldString, , , fieldBoolean, , , , fieldInteger, , , fieldRef] = resourceWithRef.supportedProperty;
var api = resources;

// src/mocks/expandedDocs.ts
var expandedEntrypoint = {
  "@id": "https://localhost/",
  "@type": ["https://localhost/docs.jsonld#Entrypoint"],
  "https://localhost/docs.jsonld#Entrypoint/catalog": [
    { "@id": "https://localhost/catalogs" }
  ],
  "https://localhost/docs.jsonld#Entrypoint/category": [
    { "@id": "https://localhost/categories" }
  ],
  "https://localhost/docs.jsonld#Entrypoint/declarativeGreeting": [
    { "@id": "https://localhost/declarative_greetings" }
  ],
  "https://localhost/docs.jsonld#Entrypoint/exampleCategory": [
    { "@id": "https://localhost/example_categories" }
  ],
  "https://localhost/docs.jsonld#Entrypoint/exampleDocument": [
    { "@id": "https://localhost/example_documents" }
  ],
  "https://localhost/docs.jsonld#Entrypoint/exampleIndex": [
    { "@id": "https://localhost/example_indices" }
  ],
  "https://localhost/docs.jsonld#Entrypoint/exampleProduct": [
    { "@id": "https://localhost/example_products" }
  ],
  "https://localhost/docs.jsonld#Entrypoint/facetConfiguration": [
    { "@id": "https://localhost/facet_configurations" }
  ],
  "https://localhost/docs.jsonld#Entrypoint/index": [
    { "@id": "https://localhost/indices" }
  ],
  "https://localhost/docs.jsonld#Entrypoint/indexDocument": [
    { "@id": "https://localhost/index_documents" }
  ],
  "https://localhost/docs.jsonld#Entrypoint/localizedCatalog": [
    { "@id": "https://localhost/localized_catalogs" }
  ],
  "https://localhost/docs.jsonld#Entrypoint/metadata": [
    { "@id": "https://localhost/metadata" }
  ],
  "https://localhost/docs.jsonld#Entrypoint/sourceField": [
    { "@id": "https://localhost/source_fields" }
  ],
  "https://localhost/docs.jsonld#Entrypoint/sourceFieldLabel": [
    { "@id": "https://localhost/source_field_labels" }
  ],
  "https://localhost/docs.jsonld#Entrypoint/sourceFieldOption": [
    { "@id": "https://localhost/source_field_options" }
  ],
  "https://localhost/docs.jsonld#Entrypoint/sourceFieldOptionLabel": [
    { "@id": "https://localhost/source_field_option_labels" }
  ]
};
var expandedDocs = {
  "@id": "https://localhost/docs.jsonld",
  "@type": ["http://www.w3.org/ns/hydra/core#ApiDocumentation"],
  "http://www.w3.org/ns/hydra/core#entrypoint": [{ "@value": "/" }],
  "http://www.w3.org/ns/hydra/core#supportedClass": [
    {
      "@id": "https://localhost/docs.jsonld#Index",
      "@type": ["http://www.w3.org/ns/hydra/core#Class"],
      "http://www.w3.org/ns/hydra/core#supportedOperation": [
        {
          "@type": [
            "http://www.w3.org/ns/hydra/core#Operation",
            "http://schema.org/FindAction"
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "GET" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Retrieves Index resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Retrieves Index resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "https://localhost/docs.jsonld#Index" }
          ]
        },
        {
          "@type": [
            "http://www.w3.org/ns/hydra/core#Operation",
            "http://schema.org/DeleteAction"
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "DELETE" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Deletes the Index resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Deletes the Index resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "http://www.w3.org/2002/07/owl#Nothing" }
          ]
        },
        {
          "@type": [
            "http://www.w3.org/ns/hydra/core#Operation",
            "http://schema.org/ReplaceAction"
          ],
          "http://www.w3.org/ns/hydra/core#expects": [
            { "@id": "https://localhost/docs.jsonld#Index" }
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "PUT" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Replaces the Index resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Replaces the Index resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "https://localhost/docs.jsonld#Index" }
          ]
        },
        {
          "@type": [
            "http://www.w3.org/ns/hydra/core#Operation",
            "http://schema.org/ReplaceAction"
          ],
          "http://www.w3.org/ns/hydra/core#expects": [
            { "@id": "https://localhost/docs.jsonld#Index" }
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "PUT" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Replaces the Index resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Replaces the Index resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "https://localhost/docs.jsonld#Index" }
          ]
        }
      ],
      "http://www.w3.org/ns/hydra/core#supportedProperty": [
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#Index/name",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#Index" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#string" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "name" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [{ "@value": "name" }],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#Index/aliases",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#Index" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#string" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "aliases" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [{ "@value": "aliases" }],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#Index/docsCount",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#Index" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#integer" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "docsCount" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [{ "@value": "docsCount" }],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#Index/size",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#Index" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#string" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "size" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [{ "@value": "size" }],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#Index/entityType",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#Index" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#string" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "entityType" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [{ "@value": "entityType" }],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#Index/catalog",
              "@type": ["http://www.w3.org/ns/hydra/core#Link"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#Index" }
              ],
              "http://www.w3.org/2002/07/owl#maxCardinality": [{ "@value": 1 }],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "https://localhost/docs.jsonld#LocalizedCatalog" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "catalog" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [{ "@value": "catalog" }],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#Index/status",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#Index" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#string" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "status" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [{ "@value": "status" }],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        }
      ],
      "http://www.w3.org/ns/hydra/core#title": [{ "@value": "Index" }],
      "http://www.w3.org/2000/01/rdf-schema#label": [{ "@value": "Index" }]
    },
    {
      "@id": "https://localhost/docs.jsonld#MappingStatus",
      "@type": ["http://www.w3.org/ns/hydra/core#Class"],
      "http://www.w3.org/ns/hydra/core#supportedOperation": [
        {
          "@type": [
            "http://www.w3.org/ns/hydra/core#Operation",
            "http://schema.org/FindAction"
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "GET" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Retrieves MappingStatus resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Retrieves MappingStatus resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "https://localhost/docs.jsonld#MappingStatus" }
          ]
        }
      ],
      "http://www.w3.org/ns/hydra/core#supportedProperty": [],
      "http://www.w3.org/ns/hydra/core#title": [{ "@value": "MappingStatus" }],
      "http://www.w3.org/2000/01/rdf-schema#label": [
        { "@value": "MappingStatus" }
      ]
    },
    {
      "@id": "https://localhost/docs.jsonld#IndexDocument",
      "@type": ["http://www.w3.org/ns/hydra/core#Class"],
      "http://www.w3.org/ns/hydra/core#supportedOperation": [
        {
          "@type": [
            "http://www.w3.org/ns/hydra/core#Operation",
            "http://schema.org/FindAction"
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "GET" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Retrieves IndexDocument resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Retrieves IndexDocument resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "https://localhost/docs.jsonld#IndexDocument" }
          ]
        },
        {
          "@type": [
            "http://www.w3.org/ns/hydra/core#Operation",
            "http://schema.org/DeleteAction"
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "DELETE" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Deletes the IndexDocument resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Deletes the IndexDocument resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "http://www.w3.org/2002/07/owl#Nothing" }
          ]
        }
      ],
      "http://www.w3.org/ns/hydra/core#supportedProperty": [
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#IndexDocument/indexName",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#IndexDocument" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#string" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "indexName" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [{ "@value": "indexName" }],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#IndexDocument/documents",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#IndexDocument" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#string" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "documents" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [{ "@value": "documents" }],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        }
      ],
      "http://www.w3.org/ns/hydra/core#title": [{ "@value": "IndexDocument" }],
      "http://www.w3.org/2000/01/rdf-schema#label": [
        { "@value": "IndexDocument" }
      ]
    },
    {
      "@id": "https://localhost/docs.jsonld#SourceFieldOption",
      "@type": ["http://www.w3.org/ns/hydra/core#Class"],
      "http://www.w3.org/ns/hydra/core#supportedOperation": [
        {
          "@type": [
            "http://www.w3.org/ns/hydra/core#Operation",
            "http://schema.org/FindAction"
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "GET" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Retrieves SourceFieldOption resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Retrieves SourceFieldOption resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "https://localhost/docs.jsonld#SourceFieldOption" }
          ]
        },
        {
          "@type": [
            "http://www.w3.org/ns/hydra/core#Operation",
            "http://schema.org/ReplaceAction"
          ],
          "http://www.w3.org/ns/hydra/core#expects": [
            { "@id": "https://localhost/docs.jsonld#SourceFieldOption" }
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "PUT" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Replaces the SourceFieldOption resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Replaces the SourceFieldOption resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "https://localhost/docs.jsonld#SourceFieldOption" }
          ]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#Operation"],
          "http://www.w3.org/ns/hydra/core#expects": [
            { "@id": "https://localhost/docs.jsonld#SourceFieldOption" }
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "PATCH" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Updates the SourceFieldOption resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Updates the SourceFieldOption resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "https://localhost/docs.jsonld#SourceFieldOption" }
          ]
        },
        {
          "@type": [
            "http://www.w3.org/ns/hydra/core#Operation",
            "http://schema.org/DeleteAction"
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "DELETE" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Deletes the SourceFieldOption resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Deletes the SourceFieldOption resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "http://www.w3.org/2002/07/owl#Nothing" }
          ]
        }
      ],
      "http://www.w3.org/ns/hydra/core#supportedProperty": [
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#SourceFieldOption/sourceField",
              "@type": ["http://www.w3.org/ns/hydra/core#Link"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#SourceFieldOption" }
              ],
              "http://www.w3.org/2002/07/owl#maxCardinality": [{ "@value": 1 }],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "https://localhost/docs.jsonld#SourceField" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "sourceField" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "sourceField" }
          ],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#SourceFieldOption/position",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#SourceFieldOption" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#integer" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "position" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [{ "@value": "position" }],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#SourceFieldOption/labels",
              "@type": ["http://www.w3.org/ns/hydra/core#Link"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#SourceFieldOption" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                {
                  "@id": "https://localhost/docs.jsonld#SourceFieldOptionLabel"
                }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "labels" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [{ "@value": "labels" }],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        }
      ],
      "http://www.w3.org/ns/hydra/core#title": [
        { "@value": "SourceFieldOption" }
      ],
      "http://www.w3.org/2000/01/rdf-schema#label": [
        { "@value": "SourceFieldOption" }
      ]
    },
    {
      "@id": "https://localhost/docs.jsonld#SourceField",
      "@type": ["http://www.w3.org/ns/hydra/core#Class"],
      "http://www.w3.org/ns/hydra/core#supportedOperation": [
        {
          "@type": [
            "http://www.w3.org/ns/hydra/core#Operation",
            "http://schema.org/FindAction"
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "GET" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Retrieves SourceField resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Retrieves SourceField resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "https://localhost/docs.jsonld#SourceField" }
          ]
        },
        {
          "@type": [
            "http://www.w3.org/ns/hydra/core#Operation",
            "http://schema.org/ReplaceAction"
          ],
          "http://www.w3.org/ns/hydra/core#expects": [
            { "@id": "https://localhost/docs.jsonld#SourceField" }
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "PUT" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Replaces the SourceField resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Replaces the SourceField resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "https://localhost/docs.jsonld#SourceField" }
          ]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#Operation"],
          "http://www.w3.org/ns/hydra/core#expects": [
            { "@id": "https://localhost/docs.jsonld#SourceField" }
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "PATCH" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Updates the SourceField resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Updates the SourceField resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "https://localhost/docs.jsonld#SourceField" }
          ]
        },
        {
          "@type": [
            "http://www.w3.org/ns/hydra/core#Operation",
            "http://schema.org/DeleteAction"
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "DELETE" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Deletes the SourceField resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Deletes the SourceField resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "http://www.w3.org/2002/07/owl#Nothing" }
          ]
        }
      ],
      "http://www.w3.org/ns/hydra/core#supportedProperty": [
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "https://localhost/docs.jsonld#elasticsuite": [
            {
              "https://localhost/docs.jsonld#editable": [{ "@value": false }],
              "https://localhost/docs.jsonld#position": [{ "@value": 10 }],
              "https://localhost/docs.jsonld#visible": [{ "@value": true }]
            }
          ],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#SourceField/code",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#SourceField" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#string" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "Attribute code" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#title": [{ "@value": "code" }],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "https://localhost/docs.jsonld#elasticsuite": [
            {
              "https://localhost/docs.jsonld#editable": [{ "@value": false }],
              "https://localhost/docs.jsonld#position": [{ "@value": 20 }],
              "https://localhost/docs.jsonld#visible": [{ "@value": true }]
            }
          ],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#SourceField/defaultLabel",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#SourceField" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#string" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "Attribute label" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "defaultLabel" }
          ],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "https://localhost/docs.jsonld#elasticsuite": [
            {
              "https://localhost/docs.jsonld#context": [
                {
                  "https://localhost/docs.jsonld#grid_2": [
                    {
                      "https://localhost/docs.jsonld#visible": [
                        { "@value": false }
                      ]
                    }
                  ]
                }
              ],
              "https://localhost/docs.jsonld#editable": [{ "@value": false }],
              "https://localhost/docs.jsonld#position": [{ "@value": 30 }],
              "https://localhost/docs.jsonld#visible": [{ "@value": true }]
            }
          ],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#SourceField/type",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#SourceField" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#string" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "Attribute type" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [{ "@value": "type" }],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "https://localhost/docs.jsonld#elasticsuite": [
            {
              "https://localhost/docs.jsonld#context": [
                {
                  "https://localhost/docs.jsonld#grid_2": [
                    {
                      "https://localhost/docs.jsonld#visible": [
                        { "@value": false }
                      ]
                    }
                  ]
                }
              ],
              "https://localhost/docs.jsonld#editable": [{ "@value": true }],
              "https://localhost/docs.jsonld#position": [{ "@value": 40 }],
              "https://localhost/docs.jsonld#visible": [{ "@value": true }]
            }
          ],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#SourceField/isFilterable",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#SourceField" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#boolean" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "Filterable" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "isFilterable" }
          ],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "https://localhost/docs.jsonld#elasticsuite": [
            {
              "https://localhost/docs.jsonld#context": [
                {
                  "https://localhost/docs.jsonld#grid_2": [
                    {
                      "https://localhost/docs.jsonld#visible": [
                        { "@value": false }
                      ]
                    }
                  ]
                }
              ],
              "https://localhost/docs.jsonld#editable": [{ "@value": true }],
              "https://localhost/docs.jsonld#position": [{ "@value": 50 }],
              "https://localhost/docs.jsonld#visible": [{ "@value": true }]
            }
          ],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#SourceField/isSearchable",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#SourceField" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#boolean" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "Searchable" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "isSearchable" }
          ],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "https://localhost/docs.jsonld#elasticsuite": [
            {
              "https://localhost/docs.jsonld#context": [
                {
                  "https://localhost/docs.jsonld#grid_2": [
                    {
                      "https://localhost/docs.jsonld#visible": [
                        { "@value": false }
                      ]
                    }
                  ]
                }
              ],
              "https://localhost/docs.jsonld#editable": [{ "@value": true }],
              "https://localhost/docs.jsonld#position": [{ "@value": 60 }],
              "https://localhost/docs.jsonld#visible": [{ "@value": true }]
            }
          ],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#SourceField/isSortable",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#SourceField" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#boolean" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "Sortable" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [{ "@value": "isSortable" }],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "https://localhost/docs.jsonld#elasticsuite": [
            {
              "https://localhost/docs.jsonld#context": [
                {
                  "https://localhost/docs.jsonld#grid_2": [
                    {
                      "https://localhost/docs.jsonld#visible": [
                        { "@value": false }
                      ]
                    }
                  ]
                }
              ],
              "https://localhost/docs.jsonld#editable": [{ "@value": true }],
              "https://localhost/docs.jsonld#position": [{ "@value": 70 }],
              "https://localhost/docs.jsonld#visible": [{ "@value": true }]
            }
          ],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#SourceField/isUsedForRules",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#SourceField" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#boolean" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "Use in rule engine" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "isUsedForRules" }
          ],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "https://localhost/docs.jsonld#elasticsuite": [
            {
              "https://localhost/docs.jsonld#context": [
                {
                  "https://localhost/docs.jsonld#grid_2": [
                    {
                      "https://localhost/docs.jsonld#visible": [
                        { "@value": true }
                      ]
                    }
                  ]
                }
              ],
              "https://localhost/docs.jsonld#editable": [{ "@value": true }],
              "https://localhost/docs.jsonld#position": [{ "@value": 80 }],
              "https://localhost/docs.jsonld#visible": [{ "@value": false }]
            }
          ],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#SourceField/weight",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#SourceField" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#integer" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "Search weight" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [{ "@value": "weight" }],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "https://localhost/docs.jsonld#elasticsuite": [
            {
              "https://localhost/docs.jsonld#context": [
                {
                  "https://localhost/docs.jsonld#grid_2": [
                    {
                      "https://localhost/docs.jsonld#visible": [
                        { "@value": true }
                      ]
                    }
                  ]
                }
              ],
              "https://localhost/docs.jsonld#editable": [{ "@value": true }],
              "https://localhost/docs.jsonld#position": [{ "@value": 90 }],
              "https://localhost/docs.jsonld#visible": [{ "@value": false }]
            }
          ],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#SourceField/isSpellchecked",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#SourceField" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#boolean" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "Used in spellcheck" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "isSpellchecked" }
          ],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#SourceField/isSystem",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#SourceField" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#boolean" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "isSystem" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [{ "@value": "isSystem" }],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#SourceField/metadata",
              "@type": ["http://www.w3.org/ns/hydra/core#Link"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#SourceField" }
              ],
              "http://www.w3.org/2002/07/owl#maxCardinality": [{ "@value": 1 }],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "https://localhost/docs.jsonld#Metadata" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "metadata" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#title": [{ "@value": "metadata" }],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#SourceField/labels",
              "@type": ["http://www.w3.org/ns/hydra/core#Link"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#SourceField" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "https://localhost/docs.jsonld#SourceFieldLabel" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "labels" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [{ "@value": "labels" }],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#SourceField/options",
              "@type": ["http://www.w3.org/ns/hydra/core#Link"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#SourceField" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "https://localhost/docs.jsonld#SourceFieldOption" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "options" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [{ "@value": "options" }],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        }
      ],
      "http://www.w3.org/ns/hydra/core#title": [{ "@value": "SourceField" }],
      "http://www.w3.org/2000/01/rdf-schema#label": [
        { "@value": "SourceField" }
      ]
    },
    {
      "@id": "https://localhost/docs.jsonld#SourceFieldOptionLabel",
      "@type": ["http://www.w3.org/ns/hydra/core#Class"],
      "http://www.w3.org/ns/hydra/core#supportedOperation": [
        {
          "@type": [
            "http://www.w3.org/ns/hydra/core#Operation",
            "http://schema.org/FindAction"
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "GET" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Retrieves SourceFieldOptionLabel resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Retrieves SourceFieldOptionLabel resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "https://localhost/docs.jsonld#SourceFieldOptionLabel" }
          ]
        },
        {
          "@type": [
            "http://www.w3.org/ns/hydra/core#Operation",
            "http://schema.org/ReplaceAction"
          ],
          "http://www.w3.org/ns/hydra/core#expects": [
            { "@id": "https://localhost/docs.jsonld#SourceFieldOptionLabel" }
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "PUT" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Replaces the SourceFieldOptionLabel resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Replaces the SourceFieldOptionLabel resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "https://localhost/docs.jsonld#SourceFieldOptionLabel" }
          ]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#Operation"],
          "http://www.w3.org/ns/hydra/core#expects": [
            { "@id": "https://localhost/docs.jsonld#SourceFieldOptionLabel" }
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "PATCH" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Updates the SourceFieldOptionLabel resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Updates the SourceFieldOptionLabel resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "https://localhost/docs.jsonld#SourceFieldOptionLabel" }
          ]
        },
        {
          "@type": [
            "http://www.w3.org/ns/hydra/core#Operation",
            "http://schema.org/DeleteAction"
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "DELETE" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Deletes the SourceFieldOptionLabel resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Deletes the SourceFieldOptionLabel resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "http://www.w3.org/2002/07/owl#Nothing" }
          ]
        }
      ],
      "http://www.w3.org/ns/hydra/core#supportedProperty": [
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#SourceFieldOptionLabel/sourceFieldOption",
              "@type": ["http://www.w3.org/ns/hydra/core#Link"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                {
                  "@id": "https://localhost/docs.jsonld#SourceFieldOptionLabel"
                }
              ],
              "http://www.w3.org/2002/07/owl#maxCardinality": [{ "@value": 1 }],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "https://localhost/docs.jsonld#SourceFieldOption" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "sourceFieldOption" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "sourceFieldOption" }
          ],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#SourceFieldOptionLabel/catalog",
              "@type": ["http://www.w3.org/ns/hydra/core#Link"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                {
                  "@id": "https://localhost/docs.jsonld#SourceFieldOptionLabel"
                }
              ],
              "http://www.w3.org/2002/07/owl#maxCardinality": [{ "@value": 1 }],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "https://localhost/docs.jsonld#LocalizedCatalog" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "catalog" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#title": [{ "@value": "catalog" }],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#SourceFieldOptionLabel/label",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                {
                  "@id": "https://localhost/docs.jsonld#SourceFieldOptionLabel"
                }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#string" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "label" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#title": [{ "@value": "label" }],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        }
      ],
      "http://www.w3.org/ns/hydra/core#title": [
        { "@value": "SourceFieldOptionLabel" }
      ],
      "http://www.w3.org/2000/01/rdf-schema#label": [
        { "@value": "SourceFieldOptionLabel" }
      ]
    },
    {
      "@id": "https://localhost/docs.jsonld#Metadata",
      "@type": ["http://www.w3.org/ns/hydra/core#Class"],
      "http://www.w3.org/ns/hydra/core#supportedOperation": [
        {
          "@type": [
            "http://www.w3.org/ns/hydra/core#Operation",
            "http://schema.org/FindAction"
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "GET" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Retrieves Metadata resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Retrieves Metadata resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "https://localhost/docs.jsonld#Metadata" }
          ]
        },
        {
          "@type": [
            "http://www.w3.org/ns/hydra/core#Operation",
            "http://schema.org/ReplaceAction"
          ],
          "http://www.w3.org/ns/hydra/core#expects": [
            { "@id": "https://localhost/docs.jsonld#Metadata" }
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "PUT" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Replaces the Metadata resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Replaces the Metadata resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "https://localhost/docs.jsonld#Metadata" }
          ]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#Operation"],
          "http://www.w3.org/ns/hydra/core#expects": [
            { "@id": "https://localhost/docs.jsonld#Metadata" }
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "PATCH" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Updates the Metadata resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Updates the Metadata resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "https://localhost/docs.jsonld#Metadata" }
          ]
        },
        {
          "@type": [
            "http://www.w3.org/ns/hydra/core#Operation",
            "http://schema.org/DeleteAction"
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "DELETE" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Deletes the Metadata resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Deletes the Metadata resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "http://www.w3.org/2002/07/owl#Nothing" }
          ]
        }
      ],
      "http://www.w3.org/ns/hydra/core#supportedProperty": [
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#Metadata/entity",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#Metadata" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#string" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "entity" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#title": [{ "@value": "entity" }],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#Metadata/sourceFields",
              "@type": ["http://www.w3.org/ns/hydra/core#Link"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#Metadata" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "https://localhost/docs.jsonld#SourceField" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "sourceFields" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "sourceFields" }
          ],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        }
      ],
      "http://www.w3.org/ns/hydra/core#title": [{ "@value": "Metadata" }],
      "http://www.w3.org/2000/01/rdf-schema#label": [{ "@value": "Metadata" }]
    },
    {
      "@id": "https://localhost/docs.jsonld#SourceFieldLabel",
      "@type": ["http://www.w3.org/ns/hydra/core#Class"],
      "http://www.w3.org/ns/hydra/core#supportedOperation": [
        {
          "@type": [
            "http://www.w3.org/ns/hydra/core#Operation",
            "http://schema.org/FindAction"
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "GET" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Retrieves SourceFieldLabel resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Retrieves SourceFieldLabel resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "https://localhost/docs.jsonld#SourceFieldLabel" }
          ]
        },
        {
          "@type": [
            "http://www.w3.org/ns/hydra/core#Operation",
            "http://schema.org/ReplaceAction"
          ],
          "http://www.w3.org/ns/hydra/core#expects": [
            { "@id": "https://localhost/docs.jsonld#SourceFieldLabel" }
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "PUT" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Replaces the SourceFieldLabel resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Replaces the SourceFieldLabel resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "https://localhost/docs.jsonld#SourceFieldLabel" }
          ]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#Operation"],
          "http://www.w3.org/ns/hydra/core#expects": [
            { "@id": "https://localhost/docs.jsonld#SourceFieldLabel" }
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "PATCH" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Updates the SourceFieldLabel resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Updates the SourceFieldLabel resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "https://localhost/docs.jsonld#SourceFieldLabel" }
          ]
        },
        {
          "@type": [
            "http://www.w3.org/ns/hydra/core#Operation",
            "http://schema.org/DeleteAction"
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "DELETE" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Deletes the SourceFieldLabel resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Deletes the SourceFieldLabel resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "http://www.w3.org/2002/07/owl#Nothing" }
          ]
        }
      ],
      "http://www.w3.org/ns/hydra/core#supportedProperty": [
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#SourceFieldLabel/sourceField",
              "@type": ["http://www.w3.org/ns/hydra/core#Link"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#SourceFieldLabel" }
              ],
              "http://www.w3.org/2002/07/owl#maxCardinality": [{ "@value": 1 }],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "https://localhost/docs.jsonld#SourceField" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "sourceField" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "sourceField" }
          ],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#SourceFieldLabel/catalog",
              "@type": ["http://www.w3.org/ns/hydra/core#Link"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#SourceFieldLabel" }
              ],
              "http://www.w3.org/2002/07/owl#maxCardinality": [{ "@value": 1 }],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "https://localhost/docs.jsonld#LocalizedCatalog" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "catalog" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#title": [{ "@value": "catalog" }],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#SourceFieldLabel/label",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#SourceFieldLabel" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#string" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "label" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#title": [{ "@value": "label" }],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        }
      ],
      "http://www.w3.org/ns/hydra/core#title": [
        { "@value": "SourceFieldLabel" }
      ],
      "http://www.w3.org/2000/01/rdf-schema#label": [
        { "@value": "SourceFieldLabel" }
      ]
    },
    {
      "@id": "https://localhost/docs.jsonld#Catalog",
      "@type": ["http://www.w3.org/ns/hydra/core#Class"],
      "http://www.w3.org/ns/hydra/core#supportedOperation": [
        {
          "@type": [
            "http://www.w3.org/ns/hydra/core#Operation",
            "http://schema.org/FindAction"
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "GET" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Retrieves Catalog resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Retrieves Catalog resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "https://localhost/docs.jsonld#Catalog" }
          ]
        },
        {
          "@type": [
            "http://www.w3.org/ns/hydra/core#Operation",
            "http://schema.org/ReplaceAction"
          ],
          "http://www.w3.org/ns/hydra/core#expects": [
            { "@id": "https://localhost/docs.jsonld#Catalog" }
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "PUT" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Replaces the Catalog resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Replaces the Catalog resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "https://localhost/docs.jsonld#Catalog" }
          ]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#Operation"],
          "http://www.w3.org/ns/hydra/core#expects": [
            { "@id": "https://localhost/docs.jsonld#Catalog" }
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "PATCH" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Updates the Catalog resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Updates the Catalog resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "https://localhost/docs.jsonld#Catalog" }
          ]
        },
        {
          "@type": [
            "http://www.w3.org/ns/hydra/core#Operation",
            "http://schema.org/DeleteAction"
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "DELETE" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Deletes the Catalog resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Deletes the Catalog resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "http://www.w3.org/2002/07/owl#Nothing" }
          ]
        }
      ],
      "http://www.w3.org/ns/hydra/core#supportedProperty": [
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#Catalog/code",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#Catalog" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#string" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "code" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#title": [{ "@value": "code" }],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#Catalog/name",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#Catalog" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#string" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "name" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [{ "@value": "name" }],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#Catalog/localizedCatalogs",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#Catalog" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "https://localhost/docs.jsonld#LocalizedCatalog" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "localizedCatalogs" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "localizedCatalogs" }
          ],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        }
      ],
      "http://www.w3.org/ns/hydra/core#title": [{ "@value": "Catalog" }],
      "http://www.w3.org/2000/01/rdf-schema#label": [{ "@value": "Catalog" }]
    },
    {
      "@id": "https://localhost/docs.jsonld#LocalizedCatalog",
      "@type": ["http://www.w3.org/ns/hydra/core#Class"],
      "http://www.w3.org/ns/hydra/core#supportedOperation": [
        {
          "@type": [
            "http://www.w3.org/ns/hydra/core#Operation",
            "http://schema.org/FindAction"
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "GET" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Retrieves LocalizedCatalog resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Retrieves LocalizedCatalog resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "https://localhost/docs.jsonld#LocalizedCatalog" }
          ]
        },
        {
          "@type": [
            "http://www.w3.org/ns/hydra/core#Operation",
            "http://schema.org/ReplaceAction"
          ],
          "http://www.w3.org/ns/hydra/core#expects": [
            { "@id": "https://localhost/docs.jsonld#LocalizedCatalog" }
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "PUT" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Replaces the LocalizedCatalog resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Replaces the LocalizedCatalog resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "https://localhost/docs.jsonld#LocalizedCatalog" }
          ]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#Operation"],
          "http://www.w3.org/ns/hydra/core#expects": [
            { "@id": "https://localhost/docs.jsonld#LocalizedCatalog" }
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "PATCH" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Updates the LocalizedCatalog resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Updates the LocalizedCatalog resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "https://localhost/docs.jsonld#LocalizedCatalog" }
          ]
        },
        {
          "@type": [
            "http://www.w3.org/ns/hydra/core#Operation",
            "http://schema.org/DeleteAction"
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "DELETE" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Deletes the LocalizedCatalog resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Deletes the LocalizedCatalog resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "http://www.w3.org/2002/07/owl#Nothing" }
          ]
        }
      ],
      "http://www.w3.org/ns/hydra/core#supportedProperty": [
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#LocalizedCatalog/name",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#LocalizedCatalog" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#string" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "name" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [{ "@value": "name" }],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#LocalizedCatalog/code",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#LocalizedCatalog" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#string" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "code" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#title": [{ "@value": "code" }],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#LocalizedCatalog/locale",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#LocalizedCatalog" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#string" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "locale" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#title": [{ "@value": "locale" }],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#description": [
            {
              "@value": "It's important to keep the getter for isDefault property,\notherwise Api Platform will be not able to get the value in the response,\nin other words don't rename by IsDefault()."
            }
          ],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#LocalizedCatalog/isDefault",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#LocalizedCatalog" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#boolean" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "isDefault" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [{ "@value": "isDefault" }],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#LocalizedCatalog/catalog",
              "@type": ["http://www.w3.org/ns/hydra/core#Link"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#LocalizedCatalog" }
              ],
              "http://www.w3.org/2002/07/owl#maxCardinality": [{ "@value": 1 }],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "https://localhost/docs.jsonld#Catalog" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "catalog" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#title": [{ "@value": "catalog" }],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#LocalizedCatalog/localName",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#LocalizedCatalog" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#string" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "localName" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [{ "@value": "localName" }],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": false }]
        }
      ],
      "http://www.w3.org/ns/hydra/core#title": [
        { "@value": "LocalizedCatalog" }
      ],
      "http://www.w3.org/2000/01/rdf-schema#label": [
        { "@value": "LocalizedCatalog" }
      ]
    },
    {
      "@id": "https://localhost/docs.jsonld#Authentication",
      "@type": ["http://www.w3.org/ns/hydra/core#Class"],
      "http://www.w3.org/ns/hydra/core#supportedOperation": [
        {
          "@type": [
            "http://www.w3.org/ns/hydra/core#Operation",
            "http://schema.org/FindAction"
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "GET" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Retrieves Authentication resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Retrieves Authentication resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "http://www.w3.org/2002/07/owl#Nothing" }
          ]
        }
      ],
      "http://www.w3.org/ns/hydra/core#supportedProperty": [],
      "http://www.w3.org/ns/hydra/core#title": [{ "@value": "Authentication" }],
      "http://www.w3.org/2000/01/rdf-schema#label": [
        { "@value": "Authentication" }
      ]
    },
    {
      "@id": "https://localhost/docs.jsonld#Menu",
      "@type": ["http://www.w3.org/ns/hydra/core#Class"],
      "http://www.w3.org/ns/hydra/core#supportedOperation": [
        {
          "@type": [
            "http://www.w3.org/ns/hydra/core#Operation",
            "http://schema.org/FindAction"
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "GET" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Retrieves Menu resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Retrieves Menu resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "https://localhost/docs.jsonld#Menu" }
          ]
        }
      ],
      "http://www.w3.org/ns/hydra/core#supportedProperty": [],
      "http://www.w3.org/ns/hydra/core#title": [{ "@value": "Menu" }],
      "http://www.w3.org/2000/01/rdf-schema#label": [{ "@value": "Menu" }]
    },
    {
      "@id": "https://localhost/docs.jsonld#FacetConfiguration",
      "@type": ["http://www.w3.org/ns/hydra/core#Class"],
      "http://www.w3.org/ns/hydra/core#supportedOperation": [
        {
          "@type": [
            "http://www.w3.org/ns/hydra/core#Operation",
            "http://schema.org/FindAction"
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "GET" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Retrieves FacetConfiguration resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Retrieves FacetConfiguration resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "https://localhost/docs.jsonld#FacetConfiguration" }
          ]
        },
        {
          "@type": [
            "http://www.w3.org/ns/hydra/core#Operation",
            "http://schema.org/ReplaceAction"
          ],
          "http://www.w3.org/ns/hydra/core#expects": [
            { "@id": "https://localhost/docs.jsonld#FacetConfiguration" }
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "PUT" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Replaces the FacetConfiguration resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Replaces the FacetConfiguration resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "https://localhost/docs.jsonld#FacetConfiguration" }
          ]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#Operation"],
          "http://www.w3.org/ns/hydra/core#expects": [
            { "@id": "https://localhost/docs.jsonld#FacetConfiguration" }
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "PATCH" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Updates the FacetConfiguration resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Updates the FacetConfiguration resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "https://localhost/docs.jsonld#FacetConfiguration" }
          ]
        },
        {
          "@type": [
            "http://www.w3.org/ns/hydra/core#Operation",
            "http://schema.org/DeleteAction"
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "DELETE" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Deletes the FacetConfiguration resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Deletes the FacetConfiguration resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "http://www.w3.org/2002/07/owl#Nothing" }
          ]
        }
      ],
      "http://www.w3.org/ns/hydra/core#supportedProperty": [
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#FacetConfiguration/sourceField",
              "@type": ["http://www.w3.org/ns/hydra/core#Link"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#FacetConfiguration" }
              ],
              "http://www.w3.org/2002/07/owl#maxCardinality": [{ "@value": 1 }],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "https://localhost/docs.jsonld#SourceField" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "sourceField" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "sourceField" }
          ],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#FacetConfiguration/category",
              "@type": ["http://www.w3.org/ns/hydra/core#Link"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#FacetConfiguration" }
              ],
              "http://www.w3.org/2002/07/owl#maxCardinality": [{ "@value": 1 }],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "https://localhost/docs.jsonld#Category" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "category" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [{ "@value": "category" }],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#FacetConfiguration/displayMode",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#FacetConfiguration" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#string" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "displayMode" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "displayMode" }
          ],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#FacetConfiguration/coverageRate",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#FacetConfiguration" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#integer" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "coverageRate" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "coverageRate" }
          ],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#FacetConfiguration/maxSize",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#FacetConfiguration" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#integer" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "maxSize" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [{ "@value": "maxSize" }],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#FacetConfiguration/sortOrder",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#FacetConfiguration" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#string" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "sortOrder" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [{ "@value": "sortOrder" }],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#FacetConfiguration/isRecommendable",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#FacetConfiguration" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#boolean" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "isRecommendable" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "isRecommendable" }
          ],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#FacetConfiguration/isVirtual",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#FacetConfiguration" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#boolean" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "isVirtual" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [{ "@value": "isVirtual" }],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#FacetConfiguration/defaultDisplayMode",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#FacetConfiguration" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#string" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "defaultDisplayMode" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "defaultDisplayMode" }
          ],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": false }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#FacetConfiguration/defaultCoverageRate",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#FacetConfiguration" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#integer" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "defaultCoverageRate" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "defaultCoverageRate" }
          ],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": false }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#FacetConfiguration/defaultMaxSize",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#FacetConfiguration" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#integer" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "defaultMaxSize" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "defaultMaxSize" }
          ],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": false }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#FacetConfiguration/defaultSortOrder",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#FacetConfiguration" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#string" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "defaultSortOrder" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "defaultSortOrder" }
          ],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": false }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#FacetConfiguration/defaultIsRecommendable",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#FacetConfiguration" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#boolean" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "defaultIsRecommendable" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "defaultIsRecommendable" }
          ],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": false }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#FacetConfiguration/defaultIsVirtual",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#FacetConfiguration" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#boolean" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "defaultIsVirtual" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "defaultIsVirtual" }
          ],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": false }]
        }
      ],
      "http://www.w3.org/ns/hydra/core#title": [
        { "@value": "FacetConfiguration" }
      ],
      "http://www.w3.org/2000/01/rdf-schema#label": [
        { "@value": "FacetConfiguration" }
      ]
    },
    {
      "@id": "https://localhost/docs.jsonld#Document",
      "@type": ["http://www.w3.org/ns/hydra/core#Class"],
      "http://www.w3.org/ns/hydra/core#supportedOperation": [
        {
          "@type": [
            "http://www.w3.org/ns/hydra/core#Operation",
            "http://schema.org/FindAction"
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "GET" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Retrieves Document resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Retrieves Document resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "http://www.w3.org/2002/07/owl#Nothing" }
          ]
        }
      ],
      "http://www.w3.org/ns/hydra/core#supportedProperty": [],
      "http://www.w3.org/ns/hydra/core#title": [{ "@value": "Document" }],
      "http://www.w3.org/2000/01/rdf-schema#label": [{ "@value": "Document" }]
    },
    {
      "@id": "https://localhost/docs.jsonld#Category",
      "@type": ["http://www.w3.org/ns/hydra/core#Class"],
      "http://www.w3.org/ns/hydra/core#supportedOperation": [
        {
          "@type": [
            "http://www.w3.org/ns/hydra/core#Operation",
            "http://schema.org/FindAction"
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "GET" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Retrieves Category resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Retrieves Category resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "https://localhost/docs.jsonld#Category" }
          ]
        },
        {
          "@type": [
            "http://www.w3.org/ns/hydra/core#Operation",
            "http://schema.org/ReplaceAction"
          ],
          "http://www.w3.org/ns/hydra/core#expects": [
            { "@id": "https://localhost/docs.jsonld#Category" }
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "PUT" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Replaces the Category resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Replaces the Category resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "https://localhost/docs.jsonld#Category" }
          ]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#Operation"],
          "http://www.w3.org/ns/hydra/core#expects": [
            { "@id": "https://localhost/docs.jsonld#Category" }
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "PATCH" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Updates the Category resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Updates the Category resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "https://localhost/docs.jsonld#Category" }
          ]
        },
        {
          "@type": [
            "http://www.w3.org/ns/hydra/core#Operation",
            "http://schema.org/DeleteAction"
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "DELETE" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Deletes the Category resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Deletes the Category resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "http://www.w3.org/2002/07/owl#Nothing" }
          ]
        }
      ],
      "http://www.w3.org/ns/hydra/core#supportedProperty": [
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#Category/id",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#Category" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#string" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "id" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [{ "@value": "id" }],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#Category/parentId",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#Category" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#string" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "parentId" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [{ "@value": "parentId" }],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#Category/level",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#Category" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#integer" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "level" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [{ "@value": "level" }],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#Category/path",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#Category" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#string" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "path" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [{ "@value": "path" }],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        }
      ],
      "http://www.w3.org/ns/hydra/core#title": [{ "@value": "Category" }],
      "http://www.w3.org/2000/01/rdf-schema#label": [{ "@value": "Category" }]
    },
    {
      "@id": "https://localhost/docs.jsonld#CategorySortingOption",
      "@type": ["http://www.w3.org/ns/hydra/core#Class"],
      "http://www.w3.org/ns/hydra/core#supportedOperation": [],
      "http://www.w3.org/ns/hydra/core#supportedProperty": [
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#CategorySortingOption/label",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                {
                  "@id": "https://localhost/docs.jsonld#CategorySortingOption"
                }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#string" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "label" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [{ "@value": "label" }],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#CategorySortingOption/code",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                {
                  "@id": "https://localhost/docs.jsonld#CategorySortingOption"
                }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#string" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "code" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [{ "@value": "code" }],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        }
      ],
      "http://www.w3.org/ns/hydra/core#title": [
        { "@value": "CategorySortingOption" }
      ],
      "http://www.w3.org/2000/01/rdf-schema#label": [
        { "@value": "CategorySortingOption" }
      ]
    },
    {
      "@id": "https://localhost/docs.jsonld#CategoryConfiguration",
      "@type": ["http://www.w3.org/ns/hydra/core#Class"],
      "http://www.w3.org/ns/hydra/core#supportedOperation": [
        {
          "@type": [
            "http://www.w3.org/ns/hydra/core#Operation",
            "http://schema.org/FindAction"
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "GET" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Retrieves CategoryConfiguration resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Retrieves CategoryConfiguration resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "https://localhost/docs.jsonld#CategoryConfiguration" }
          ]
        },
        {
          "@type": [
            "http://www.w3.org/ns/hydra/core#Operation",
            "http://schema.org/FindAction"
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "GET" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Retrieves CategoryConfiguration resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Retrieves CategoryConfiguration resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "https://localhost/docs.jsonld#CategoryConfiguration" }
          ]
        },
        {
          "@type": [
            "http://www.w3.org/ns/hydra/core#Operation",
            "http://schema.org/ReplaceAction"
          ],
          "http://www.w3.org/ns/hydra/core#expects": [
            { "@id": "https://localhost/docs.jsonld#CategoryConfiguration" }
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "PUT" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Replaces the CategoryConfiguration resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Replaces the CategoryConfiguration resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "https://localhost/docs.jsonld#CategoryConfiguration" }
          ]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#Operation"],
          "http://www.w3.org/ns/hydra/core#expects": [
            { "@id": "https://localhost/docs.jsonld#CategoryConfiguration" }
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "PATCH" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Updates the CategoryConfiguration resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Updates the CategoryConfiguration resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "https://localhost/docs.jsonld#CategoryConfiguration" }
          ]
        },
        {
          "@type": [
            "http://www.w3.org/ns/hydra/core#Operation",
            "http://schema.org/DeleteAction"
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "DELETE" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Deletes the CategoryConfiguration resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Deletes the CategoryConfiguration resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "http://www.w3.org/2002/07/owl#Nothing" }
          ]
        }
      ],
      "http://www.w3.org/ns/hydra/core#supportedProperty": [
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#CategoryConfiguration/category",
              "@type": ["http://www.w3.org/ns/hydra/core#Link"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                {
                  "@id": "https://localhost/docs.jsonld#CategoryConfiguration"
                }
              ],
              "http://www.w3.org/2002/07/owl#maxCardinality": [{ "@value": 1 }],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "https://localhost/docs.jsonld#Category" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "category" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [{ "@value": "category" }],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#CategoryConfiguration/catalog",
              "@type": ["http://www.w3.org/ns/hydra/core#Link"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                {
                  "@id": "https://localhost/docs.jsonld#CategoryConfiguration"
                }
              ],
              "http://www.w3.org/2002/07/owl#maxCardinality": [{ "@value": 1 }],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "https://localhost/docs.jsonld#Catalog" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "catalog" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [{ "@value": "catalog" }],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#CategoryConfiguration/localizedCatalog",
              "@type": ["http://www.w3.org/ns/hydra/core#Link"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                {
                  "@id": "https://localhost/docs.jsonld#CategoryConfiguration"
                }
              ],
              "http://www.w3.org/2002/07/owl#maxCardinality": [{ "@value": 1 }],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "https://localhost/docs.jsonld#LocalizedCatalog" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "localizedCatalog" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "localizedCatalog" }
          ],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#CategoryConfiguration/name",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                {
                  "@id": "https://localhost/docs.jsonld#CategoryConfiguration"
                }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#string" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "name" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [{ "@value": "name" }],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#CategoryConfiguration/isVirtual",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                {
                  "@id": "https://localhost/docs.jsonld#CategoryConfiguration"
                }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#boolean" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "isVirtual" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [{ "@value": "isVirtual" }],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#CategoryConfiguration/useNameInProductSearch",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                {
                  "@id": "https://localhost/docs.jsonld#CategoryConfiguration"
                }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#boolean" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "useNameInProductSearch" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "useNameInProductSearch" }
          ],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#CategoryConfiguration/defaultSorting",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                {
                  "@id": "https://localhost/docs.jsonld#CategoryConfiguration"
                }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#string" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "defaultSorting" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "defaultSorting" }
          ],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        }
      ],
      "http://www.w3.org/ns/hydra/core#title": [
        { "@value": "CategoryConfiguration" }
      ],
      "http://www.w3.org/2000/01/rdf-schema#label": [
        { "@value": "CategoryConfiguration" }
      ]
    },
    {
      "@id": "https://localhost/docs.jsonld#Product",
      "@type": ["http://www.w3.org/ns/hydra/core#Class"],
      "http://www.w3.org/ns/hydra/core#supportedOperation": [
        {
          "@type": [
            "http://www.w3.org/ns/hydra/core#Operation",
            "http://schema.org/FindAction"
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "GET" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Retrieves Product resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Retrieves Product resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "http://www.w3.org/2002/07/owl#Nothing" }
          ]
        }
      ],
      "http://www.w3.org/ns/hydra/core#supportedProperty": [],
      "http://www.w3.org/ns/hydra/core#title": [{ "@value": "Product" }],
      "http://www.w3.org/2000/01/rdf-schema#label": [{ "@value": "Product" }]
    },
    {
      "@id": "https://localhost/docs.jsonld#ExampleDocument",
      "@type": ["http://www.w3.org/ns/hydra/core#Class"],
      "http://www.w3.org/ns/hydra/core#supportedOperation": [
        {
          "@type": [
            "http://www.w3.org/ns/hydra/core#Operation",
            "http://schema.org/FindAction"
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "GET" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Retrieves ExampleDocument resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Retrieves ExampleDocument resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "https://localhost/docs.jsonld#ExampleDocument" }
          ]
        },
        {
          "@type": [
            "http://www.w3.org/ns/hydra/core#Operation",
            "http://schema.org/DeleteAction"
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "DELETE" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Deletes the ExampleDocument resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Deletes the ExampleDocument resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "http://www.w3.org/2002/07/owl#Nothing" }
          ]
        }
      ],
      "http://www.w3.org/ns/hydra/core#supportedProperty": [
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#ExampleDocument/indexName",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#ExampleDocument" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#string" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "indexName" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [{ "@value": "indexName" }],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#ExampleDocument/documents",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#ExampleDocument" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#string" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "documents" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [{ "@value": "documents" }],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        }
      ],
      "http://www.w3.org/ns/hydra/core#title": [
        { "@value": "ExampleDocument" }
      ],
      "http://www.w3.org/2000/01/rdf-schema#label": [
        { "@value": "ExampleDocument" }
      ]
    },
    {
      "@id": "https://localhost/docs.jsonld#ExampleProduct",
      "@type": ["http://www.w3.org/ns/hydra/core#Class"],
      "http://www.w3.org/ns/hydra/core#supportedOperation": [
        {
          "@type": [
            "http://www.w3.org/ns/hydra/core#Operation",
            "http://schema.org/FindAction"
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "GET" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Retrieves ExampleProduct resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Retrieves ExampleProduct resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "https://localhost/docs.jsonld#ExampleProduct" }
          ]
        }
      ],
      "http://www.w3.org/ns/hydra/core#supportedProperty": [
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#ExampleProduct/entity_id",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#ExampleProduct" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#string" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "entity_id" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [{ "@value": "entity_id" }],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#description": [
            { "@value": "description" }
          ],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#ExampleProduct/description",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#ExampleProduct" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "description" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "description" }
          ],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#ExampleProduct/type_id",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#ExampleProduct" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#string" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "type_id" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [{ "@value": "type_id" }],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#ExampleProduct/created_at",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#ExampleProduct" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#string" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "created_at" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [{ "@value": "created_at" }],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#ExampleProduct/updated_at",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#ExampleProduct" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#string" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "updated_at" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [{ "@value": "updated_at" }],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#ExampleProduct/attributes",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#ExampleProduct" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "attributes" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [{ "@value": "attributes" }],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        }
      ],
      "http://www.w3.org/ns/hydra/core#title": [{ "@value": "ExampleProduct" }],
      "http://www.w3.org/2000/01/rdf-schema#label": [
        { "@value": "ExampleProduct" }
      ]
    },
    {
      "@id": "https://localhost/docs.jsonld#ExampleCategory",
      "@type": ["http://www.w3.org/ns/hydra/core#Class"],
      "http://www.w3.org/ns/hydra/core#supportedOperation": [
        {
          "@type": [
            "http://www.w3.org/ns/hydra/core#Operation",
            "http://schema.org/FindAction"
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "GET" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Retrieves ExampleCategory resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Retrieves ExampleCategory resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "https://localhost/docs.jsonld#ExampleCategory" }
          ]
        },
        {
          "@type": [
            "http://www.w3.org/ns/hydra/core#Operation",
            "http://schema.org/ReplaceAction"
          ],
          "http://www.w3.org/ns/hydra/core#expects": [
            { "@id": "https://localhost/docs.jsonld#ExampleCategory" }
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "PUT" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Replaces the ExampleCategory resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Replaces the ExampleCategory resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "https://localhost/docs.jsonld#ExampleCategory" }
          ]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#Operation"],
          "http://www.w3.org/ns/hydra/core#expects": [
            { "@id": "https://localhost/docs.jsonld#ExampleCategory" }
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "PATCH" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Updates the ExampleCategory resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Updates the ExampleCategory resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "https://localhost/docs.jsonld#ExampleCategory" }
          ]
        },
        {
          "@type": [
            "http://www.w3.org/ns/hydra/core#Operation",
            "http://schema.org/DeleteAction"
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "DELETE" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Deletes the ExampleCategory resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Deletes the ExampleCategory resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "http://www.w3.org/2002/07/owl#Nothing" }
          ]
        }
      ],
      "http://www.w3.org/ns/hydra/core#supportedProperty": [
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#ExampleCategory/name",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#ExampleCategory" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#string" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "name" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [{ "@value": "name" }],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#ExampleCategory/description",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#ExampleCategory" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#string" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "description" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "description" }
          ],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        }
      ],
      "http://www.w3.org/ns/hydra/core#title": [
        { "@value": "ExampleCategory" }
      ],
      "http://www.w3.org/2000/01/rdf-schema#label": [
        { "@value": "ExampleCategory" }
      ]
    },
    {
      "@id": "https://localhost/docs.jsonld#ExampleIndex",
      "@type": ["http://www.w3.org/ns/hydra/core#Class"],
      "http://www.w3.org/ns/hydra/core#supportedOperation": [
        {
          "@type": [
            "http://www.w3.org/ns/hydra/core#Operation",
            "http://schema.org/FindAction"
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "GET" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Retrieves ExampleIndex resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Retrieves ExampleIndex resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "https://localhost/docs.jsonld#ExampleIndex" }
          ]
        },
        {
          "@type": [
            "http://www.w3.org/ns/hydra/core#Operation",
            "http://schema.org/DeleteAction"
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "DELETE" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Deletes the ExampleIndex resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Deletes the ExampleIndex resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "http://www.w3.org/2002/07/owl#Nothing" }
          ]
        }
      ],
      "http://www.w3.org/ns/hydra/core#supportedProperty": [
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#ExampleIndex/name",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#ExampleIndex" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#string" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "name" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [{ "@value": "name" }],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#description": [
            { "@value": "health" }
          ],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#ExampleIndex/health",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#ExampleIndex" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#string" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "health" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": false }],
          "http://www.w3.org/ns/hydra/core#title": [{ "@value": "health" }],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        }
      ],
      "http://www.w3.org/ns/hydra/core#title": [{ "@value": "ExampleIndex" }],
      "http://www.w3.org/2000/01/rdf-schema#label": [
        { "@value": "ExampleIndex" }
      ]
    },
    {
      "@id": "https://localhost/docs.jsonld#ExampleResultDocument",
      "@type": ["http://www.w3.org/ns/hydra/core#Class"],
      "http://www.w3.org/ns/hydra/core#supportedOperation": [
        {
          "@type": [
            "http://www.w3.org/ns/hydra/core#Operation",
            "http://schema.org/FindAction"
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "GET" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Retrieves ExampleResultDocument resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Retrieves ExampleResultDocument resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "http://www.w3.org/2002/07/owl#Nothing" }
          ]
        }
      ],
      "http://www.w3.org/ns/hydra/core#supportedProperty": [],
      "http://www.w3.org/ns/hydra/core#title": [
        { "@value": "ExampleResultDocument" }
      ],
      "http://www.w3.org/2000/01/rdf-schema#label": [
        { "@value": "ExampleResultDocument" }
      ]
    },
    {
      "@id": "https://localhost/Declarative Greeting",
      "@type": ["http://www.w3.org/ns/hydra/core#Class"],
      "http://www.w3.org/ns/hydra/core#description": [
        { "@value": "Description of declarative greetings (description)" }
      ],
      "http://www.w3.org/ns/hydra/core#supportedOperation": [
        {
          "@type": [
            "http://www.w3.org/ns/hydra/core#Operation",
            "http://schema.org/FindAction"
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "GET" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Retrieves DeclarativeGreeting resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Retrieves DeclarativeGreeting resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "https://localhost/Declarative Greeting" }
          ]
        },
        {
          "@type": [
            "http://www.w3.org/ns/hydra/core#Operation",
            "http://schema.org/DeleteAction"
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "DELETE" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Deletes the DeclarativeGreeting resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Deletes the DeclarativeGreeting resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "http://www.w3.org/2002/07/owl#Nothing" }
          ]
        },
        {
          "@type": [
            "http://www.w3.org/ns/hydra/core#Operation",
            "http://schema.org/ReplaceAction"
          ],
          "http://www.w3.org/ns/hydra/core#expects": [
            { "@id": "https://localhost/Declarative Greeting" }
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "PUT" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Replaces the DeclarativeGreeting resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Replaces the DeclarativeGreeting resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "https://localhost/Declarative Greeting" }
          ]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#Operation"],
          "http://www.w3.org/ns/hydra/core#expects": [
            { "@id": "https://localhost/Declarative Greeting" }
          ],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "PATCH" }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "Updates the DeclarativeGreeting resource." }
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "Updates the DeclarativeGreeting resource." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "https://localhost/Declarative Greeting" }
          ]
        }
      ],
      "http://www.w3.org/ns/hydra/core#supportedProperty": [
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#description": [
            { "@value": "A nice person." }
          ],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#DeclarativeGreeting/name",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/Declarative Greeting" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#string" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "name" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#required": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#title": [{ "@value": "name" }],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": true }]
        }
      ],
      "http://www.w3.org/ns/hydra/core#title": [
        { "@value": "DeclarativeGreeting" }
      ],
      "http://www.w3.org/2000/01/rdf-schema#label": [
        { "@value": "DeclarativeGreeting" }
      ]
    },
    {
      "@id": "https://localhost/docs.jsonld#Entrypoint",
      "@type": ["http://www.w3.org/ns/hydra/core#Class"],
      "http://www.w3.org/ns/hydra/core#supportedOperation": [
        {
          "@type": ["http://www.w3.org/ns/hydra/core#Operation"],
          "http://www.w3.org/ns/hydra/core#method": [{ "@value": "GET" }],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            { "@value": "The API entrypoint." }
          ],
          "http://www.w3.org/ns/hydra/core#returns": [
            { "@id": "https://localhost/docs.jsonld#EntryPoint" }
          ]
        }
      ],
      "http://www.w3.org/ns/hydra/core#supportedProperty": [
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#Entrypoint/index",
              "@type": ["http://www.w3.org/ns/hydra/core#Link"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#Entrypoint" }
              ],
              "http://www.w3.org/ns/hydra/core#supportedOperation": [
                {
                  "@type": [
                    "http://www.w3.org/ns/hydra/core#Operation",
                    "http://schema.org/FindAction"
                  ],
                  "http://www.w3.org/ns/hydra/core#method": [
                    { "@value": "GET" }
                  ],
                  "http://www.w3.org/ns/hydra/core#title": [
                    {
                      "@value": "Retrieves the collection of Index resources."
                    }
                  ],
                  "http://www.w3.org/2000/01/rdf-schema#label": [
                    {
                      "@value": "Retrieves the collection of Index resources."
                    }
                  ],
                  "http://www.w3.org/ns/hydra/core#returns": [
                    { "@id": "http://www.w3.org/ns/hydra/core#Collection" }
                  ]
                },
                {
                  "@type": [
                    "http://www.w3.org/ns/hydra/core#Operation",
                    "http://schema.org/CreateAction"
                  ],
                  "http://www.w3.org/ns/hydra/core#expects": [
                    { "@id": "https://localhost/docs.jsonld#Index" }
                  ],
                  "http://www.w3.org/ns/hydra/core#method": [
                    { "@value": "POST" }
                  ],
                  "http://www.w3.org/ns/hydra/core#title": [
                    { "@value": "Creates a Index resource." }
                  ],
                  "http://www.w3.org/2000/01/rdf-schema#label": [
                    { "@value": "Creates a Index resource." }
                  ],
                  "http://www.w3.org/ns/hydra/core#returns": [
                    { "@id": "https://localhost/docs.jsonld#Index" }
                  ]
                }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "The collection of Index resources" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/ns/hydra/core#Collection" },
                {
                  "http://www.w3.org/2002/07/owl#equivalentClass": [
                    {
                      "http://www.w3.org/2002/07/owl#allValuesFrom": [
                        { "@id": "https://localhost/docs.jsonld#Index" }
                      ],
                      "http://www.w3.org/2002/07/owl#onProperty": [
                        { "@id": "http://www.w3.org/ns/hydra/core#member" }
                      ]
                    }
                  ]
                }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "The collection of Index resources" }
          ],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": false }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#Entrypoint/indexDocument",
              "@type": ["http://www.w3.org/ns/hydra/core#Link"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#Entrypoint" }
              ],
              "http://www.w3.org/ns/hydra/core#supportedOperation": [
                {
                  "@type": [
                    "http://www.w3.org/ns/hydra/core#Operation",
                    "http://schema.org/FindAction"
                  ],
                  "http://www.w3.org/ns/hydra/core#method": [
                    { "@value": "GET" }
                  ],
                  "http://www.w3.org/ns/hydra/core#title": [
                    {
                      "@value": "Retrieves the collection of IndexDocument resources."
                    }
                  ],
                  "http://www.w3.org/2000/01/rdf-schema#label": [
                    {
                      "@value": "Retrieves the collection of IndexDocument resources."
                    }
                  ],
                  "http://www.w3.org/ns/hydra/core#returns": [
                    { "@id": "http://www.w3.org/ns/hydra/core#Collection" }
                  ]
                },
                {
                  "@type": [
                    "http://www.w3.org/ns/hydra/core#Operation",
                    "http://schema.org/CreateAction"
                  ],
                  "http://www.w3.org/ns/hydra/core#expects": [
                    { "@id": "https://localhost/docs.jsonld#IndexDocument" }
                  ],
                  "http://www.w3.org/ns/hydra/core#method": [
                    { "@value": "POST" }
                  ],
                  "http://www.w3.org/ns/hydra/core#title": [
                    { "@value": "Creates a IndexDocument resource." }
                  ],
                  "http://www.w3.org/2000/01/rdf-schema#label": [
                    { "@value": "Creates a IndexDocument resource." }
                  ],
                  "http://www.w3.org/ns/hydra/core#returns": [
                    { "@id": "https://localhost/docs.jsonld#IndexDocument" }
                  ]
                }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "The collection of IndexDocument resources" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/ns/hydra/core#Collection" },
                {
                  "http://www.w3.org/2002/07/owl#equivalentClass": [
                    {
                      "http://www.w3.org/2002/07/owl#allValuesFrom": [
                        {
                          "@id": "https://localhost/docs.jsonld#IndexDocument"
                        }
                      ],
                      "http://www.w3.org/2002/07/owl#onProperty": [
                        { "@id": "http://www.w3.org/ns/hydra/core#member" }
                      ]
                    }
                  ]
                }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "The collection of IndexDocument resources" }
          ],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": false }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#Entrypoint/sourceFieldOption",
              "@type": ["http://www.w3.org/ns/hydra/core#Link"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#Entrypoint" }
              ],
              "http://www.w3.org/ns/hydra/core#supportedOperation": [
                {
                  "@type": [
                    "http://www.w3.org/ns/hydra/core#Operation",
                    "http://schema.org/FindAction"
                  ],
                  "http://www.w3.org/ns/hydra/core#method": [
                    { "@value": "GET" }
                  ],
                  "http://www.w3.org/ns/hydra/core#title": [
                    {
                      "@value": "Retrieves the collection of SourceFieldOption resources."
                    }
                  ],
                  "http://www.w3.org/2000/01/rdf-schema#label": [
                    {
                      "@value": "Retrieves the collection of SourceFieldOption resources."
                    }
                  ],
                  "http://www.w3.org/ns/hydra/core#returns": [
                    { "@id": "http://www.w3.org/ns/hydra/core#Collection" }
                  ]
                },
                {
                  "@type": [
                    "http://www.w3.org/ns/hydra/core#Operation",
                    "http://schema.org/CreateAction"
                  ],
                  "http://www.w3.org/ns/hydra/core#expects": [
                    {
                      "@id": "https://localhost/docs.jsonld#SourceFieldOption"
                    }
                  ],
                  "http://www.w3.org/ns/hydra/core#method": [
                    { "@value": "POST" }
                  ],
                  "http://www.w3.org/ns/hydra/core#title": [
                    { "@value": "Creates a SourceFieldOption resource." }
                  ],
                  "http://www.w3.org/2000/01/rdf-schema#label": [
                    { "@value": "Creates a SourceFieldOption resource." }
                  ],
                  "http://www.w3.org/ns/hydra/core#returns": [
                    {
                      "@id": "https://localhost/docs.jsonld#SourceFieldOption"
                    }
                  ]
                }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "The collection of SourceFieldOption resources" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/ns/hydra/core#Collection" },
                {
                  "http://www.w3.org/2002/07/owl#equivalentClass": [
                    {
                      "http://www.w3.org/2002/07/owl#allValuesFrom": [
                        {
                          "@id": "https://localhost/docs.jsonld#SourceFieldOption"
                        }
                      ],
                      "http://www.w3.org/2002/07/owl#onProperty": [
                        { "@id": "http://www.w3.org/ns/hydra/core#member" }
                      ]
                    }
                  ]
                }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "The collection of SourceFieldOption resources" }
          ],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": false }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#Entrypoint/sourceField",
              "@type": ["http://www.w3.org/ns/hydra/core#Link"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#Entrypoint" }
              ],
              "http://www.w3.org/ns/hydra/core#supportedOperation": [
                {
                  "@type": [
                    "http://www.w3.org/ns/hydra/core#Operation",
                    "http://schema.org/FindAction"
                  ],
                  "http://www.w3.org/ns/hydra/core#method": [
                    { "@value": "GET" }
                  ],
                  "http://www.w3.org/ns/hydra/core#title": [
                    {
                      "@value": "Retrieves the collection of SourceField resources."
                    }
                  ],
                  "http://www.w3.org/2000/01/rdf-schema#label": [
                    {
                      "@value": "Retrieves the collection of SourceField resources."
                    }
                  ],
                  "http://www.w3.org/ns/hydra/core#returns": [
                    { "@id": "http://www.w3.org/ns/hydra/core#Collection" }
                  ]
                },
                {
                  "@type": [
                    "http://www.w3.org/ns/hydra/core#Operation",
                    "http://schema.org/CreateAction"
                  ],
                  "http://www.w3.org/ns/hydra/core#expects": [
                    { "@id": "https://localhost/docs.jsonld#SourceField" }
                  ],
                  "http://www.w3.org/ns/hydra/core#method": [
                    { "@value": "POST" }
                  ],
                  "http://www.w3.org/ns/hydra/core#title": [
                    { "@value": "Creates a SourceField resource." }
                  ],
                  "http://www.w3.org/2000/01/rdf-schema#label": [
                    { "@value": "Creates a SourceField resource." }
                  ],
                  "http://www.w3.org/ns/hydra/core#returns": [
                    { "@id": "https://localhost/docs.jsonld#SourceField" }
                  ]
                }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "The collection of SourceField resources" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/ns/hydra/core#Collection" },
                {
                  "http://www.w3.org/2002/07/owl#equivalentClass": [
                    {
                      "http://www.w3.org/2002/07/owl#allValuesFrom": [
                        {
                          "@id": "https://localhost/docs.jsonld#SourceField"
                        }
                      ],
                      "http://www.w3.org/2002/07/owl#onProperty": [
                        { "@id": "http://www.w3.org/ns/hydra/core#member" }
                      ]
                    }
                  ]
                }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "The collection of SourceField resources" }
          ],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": false }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#Entrypoint/sourceFieldOptionLabel",
              "@type": ["http://www.w3.org/ns/hydra/core#Link"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#Entrypoint" }
              ],
              "http://www.w3.org/ns/hydra/core#supportedOperation": [
                {
                  "@type": [
                    "http://www.w3.org/ns/hydra/core#Operation",
                    "http://schema.org/FindAction"
                  ],
                  "http://www.w3.org/ns/hydra/core#method": [
                    { "@value": "GET" }
                  ],
                  "http://www.w3.org/ns/hydra/core#title": [
                    {
                      "@value": "Retrieves the collection of SourceFieldOptionLabel resources."
                    }
                  ],
                  "http://www.w3.org/2000/01/rdf-schema#label": [
                    {
                      "@value": "Retrieves the collection of SourceFieldOptionLabel resources."
                    }
                  ],
                  "http://www.w3.org/ns/hydra/core#returns": [
                    { "@id": "http://www.w3.org/ns/hydra/core#Collection" }
                  ]
                },
                {
                  "@type": [
                    "http://www.w3.org/ns/hydra/core#Operation",
                    "http://schema.org/CreateAction"
                  ],
                  "http://www.w3.org/ns/hydra/core#expects": [
                    {
                      "@id": "https://localhost/docs.jsonld#SourceFieldOptionLabel"
                    }
                  ],
                  "http://www.w3.org/ns/hydra/core#method": [
                    { "@value": "POST" }
                  ],
                  "http://www.w3.org/ns/hydra/core#title": [
                    {
                      "@value": "Creates a SourceFieldOptionLabel resource."
                    }
                  ],
                  "http://www.w3.org/2000/01/rdf-schema#label": [
                    {
                      "@value": "Creates a SourceFieldOptionLabel resource."
                    }
                  ],
                  "http://www.w3.org/ns/hydra/core#returns": [
                    {
                      "@id": "https://localhost/docs.jsonld#SourceFieldOptionLabel"
                    }
                  ]
                }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                {
                  "@value": "The collection of SourceFieldOptionLabel resources"
                }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/ns/hydra/core#Collection" },
                {
                  "http://www.w3.org/2002/07/owl#equivalentClass": [
                    {
                      "http://www.w3.org/2002/07/owl#allValuesFrom": [
                        {
                          "@id": "https://localhost/docs.jsonld#SourceFieldOptionLabel"
                        }
                      ],
                      "http://www.w3.org/2002/07/owl#onProperty": [
                        { "@id": "http://www.w3.org/ns/hydra/core#member" }
                      ]
                    }
                  ]
                }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#title": [
            {
              "@value": "The collection of SourceFieldOptionLabel resources"
            }
          ],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": false }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#Entrypoint/metadata",
              "@type": ["http://www.w3.org/ns/hydra/core#Link"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#Entrypoint" }
              ],
              "http://www.w3.org/ns/hydra/core#supportedOperation": [
                {
                  "@type": [
                    "http://www.w3.org/ns/hydra/core#Operation",
                    "http://schema.org/FindAction"
                  ],
                  "http://www.w3.org/ns/hydra/core#method": [
                    { "@value": "GET" }
                  ],
                  "http://www.w3.org/ns/hydra/core#title": [
                    {
                      "@value": "Retrieves the collection of Metadata resources."
                    }
                  ],
                  "http://www.w3.org/2000/01/rdf-schema#label": [
                    {
                      "@value": "Retrieves the collection of Metadata resources."
                    }
                  ],
                  "http://www.w3.org/ns/hydra/core#returns": [
                    { "@id": "http://www.w3.org/ns/hydra/core#Collection" }
                  ]
                },
                {
                  "@type": [
                    "http://www.w3.org/ns/hydra/core#Operation",
                    "http://schema.org/CreateAction"
                  ],
                  "http://www.w3.org/ns/hydra/core#expects": [
                    { "@id": "https://localhost/docs.jsonld#Metadata" }
                  ],
                  "http://www.w3.org/ns/hydra/core#method": [
                    { "@value": "POST" }
                  ],
                  "http://www.w3.org/ns/hydra/core#title": [
                    { "@value": "Creates a Metadata resource." }
                  ],
                  "http://www.w3.org/2000/01/rdf-schema#label": [
                    { "@value": "Creates a Metadata resource." }
                  ],
                  "http://www.w3.org/ns/hydra/core#returns": [
                    { "@id": "https://localhost/docs.jsonld#Metadata" }
                  ]
                }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "The collection of Metadata resources" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/ns/hydra/core#Collection" },
                {
                  "http://www.w3.org/2002/07/owl#equivalentClass": [
                    {
                      "http://www.w3.org/2002/07/owl#allValuesFrom": [
                        { "@id": "https://localhost/docs.jsonld#Metadata" }
                      ],
                      "http://www.w3.org/2002/07/owl#onProperty": [
                        { "@id": "http://www.w3.org/ns/hydra/core#member" }
                      ]
                    }
                  ]
                }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "The collection of Metadata resources" }
          ],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": false }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#Entrypoint/sourceFieldLabel",
              "@type": ["http://www.w3.org/ns/hydra/core#Link"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#Entrypoint" }
              ],
              "http://www.w3.org/ns/hydra/core#supportedOperation": [
                {
                  "@type": [
                    "http://www.w3.org/ns/hydra/core#Operation",
                    "http://schema.org/FindAction"
                  ],
                  "http://www.w3.org/ns/hydra/core#method": [
                    { "@value": "GET" }
                  ],
                  "http://www.w3.org/ns/hydra/core#title": [
                    {
                      "@value": "Retrieves the collection of SourceFieldLabel resources."
                    }
                  ],
                  "http://www.w3.org/2000/01/rdf-schema#label": [
                    {
                      "@value": "Retrieves the collection of SourceFieldLabel resources."
                    }
                  ],
                  "http://www.w3.org/ns/hydra/core#returns": [
                    { "@id": "http://www.w3.org/ns/hydra/core#Collection" }
                  ]
                },
                {
                  "@type": [
                    "http://www.w3.org/ns/hydra/core#Operation",
                    "http://schema.org/CreateAction"
                  ],
                  "http://www.w3.org/ns/hydra/core#expects": [
                    {
                      "@id": "https://localhost/docs.jsonld#SourceFieldLabel"
                    }
                  ],
                  "http://www.w3.org/ns/hydra/core#method": [
                    { "@value": "POST" }
                  ],
                  "http://www.w3.org/ns/hydra/core#title": [
                    { "@value": "Creates a SourceFieldLabel resource." }
                  ],
                  "http://www.w3.org/2000/01/rdf-schema#label": [
                    { "@value": "Creates a SourceFieldLabel resource." }
                  ],
                  "http://www.w3.org/ns/hydra/core#returns": [
                    {
                      "@id": "https://localhost/docs.jsonld#SourceFieldLabel"
                    }
                  ]
                }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "The collection of SourceFieldLabel resources" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/ns/hydra/core#Collection" },
                {
                  "http://www.w3.org/2002/07/owl#equivalentClass": [
                    {
                      "http://www.w3.org/2002/07/owl#allValuesFrom": [
                        {
                          "@id": "https://localhost/docs.jsonld#SourceFieldLabel"
                        }
                      ],
                      "http://www.w3.org/2002/07/owl#onProperty": [
                        { "@id": "http://www.w3.org/ns/hydra/core#member" }
                      ]
                    }
                  ]
                }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "The collection of SourceFieldLabel resources" }
          ],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": false }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#Entrypoint/catalog",
              "@type": ["http://www.w3.org/ns/hydra/core#Link"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#Entrypoint" }
              ],
              "http://www.w3.org/ns/hydra/core#supportedOperation": [
                {
                  "@type": [
                    "http://www.w3.org/ns/hydra/core#Operation",
                    "http://schema.org/FindAction"
                  ],
                  "http://www.w3.org/ns/hydra/core#method": [
                    { "@value": "GET" }
                  ],
                  "http://www.w3.org/ns/hydra/core#title": [
                    {
                      "@value": "Retrieves the collection of Catalog resources."
                    }
                  ],
                  "http://www.w3.org/2000/01/rdf-schema#label": [
                    {
                      "@value": "Retrieves the collection of Catalog resources."
                    }
                  ],
                  "http://www.w3.org/ns/hydra/core#returns": [
                    { "@id": "http://www.w3.org/ns/hydra/core#Collection" }
                  ]
                },
                {
                  "@type": [
                    "http://www.w3.org/ns/hydra/core#Operation",
                    "http://schema.org/CreateAction"
                  ],
                  "http://www.w3.org/ns/hydra/core#expects": [
                    { "@id": "https://localhost/docs.jsonld#Catalog" }
                  ],
                  "http://www.w3.org/ns/hydra/core#method": [
                    { "@value": "POST" }
                  ],
                  "http://www.w3.org/ns/hydra/core#title": [
                    { "@value": "Creates a Catalog resource." }
                  ],
                  "http://www.w3.org/2000/01/rdf-schema#label": [
                    { "@value": "Creates a Catalog resource." }
                  ],
                  "http://www.w3.org/ns/hydra/core#returns": [
                    { "@id": "https://localhost/docs.jsonld#Catalog" }
                  ]
                }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "The collection of Catalog resources" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/ns/hydra/core#Collection" },
                {
                  "http://www.w3.org/2002/07/owl#equivalentClass": [
                    {
                      "http://www.w3.org/2002/07/owl#allValuesFrom": [
                        { "@id": "https://localhost/docs.jsonld#Catalog" }
                      ],
                      "http://www.w3.org/2002/07/owl#onProperty": [
                        { "@id": "http://www.w3.org/ns/hydra/core#member" }
                      ]
                    }
                  ]
                }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "The collection of Catalog resources" }
          ],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": false }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#Entrypoint/localizedCatalog",
              "@type": ["http://www.w3.org/ns/hydra/core#Link"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#Entrypoint" }
              ],
              "http://www.w3.org/ns/hydra/core#supportedOperation": [
                {
                  "@type": [
                    "http://www.w3.org/ns/hydra/core#Operation",
                    "http://schema.org/FindAction"
                  ],
                  "http://www.w3.org/ns/hydra/core#method": [
                    { "@value": "GET" }
                  ],
                  "http://www.w3.org/ns/hydra/core#title": [
                    {
                      "@value": "Retrieves the collection of LocalizedCatalog resources."
                    }
                  ],
                  "http://www.w3.org/2000/01/rdf-schema#label": [
                    {
                      "@value": "Retrieves the collection of LocalizedCatalog resources."
                    }
                  ],
                  "http://www.w3.org/ns/hydra/core#returns": [
                    { "@id": "http://www.w3.org/ns/hydra/core#Collection" }
                  ]
                },
                {
                  "@type": [
                    "http://www.w3.org/ns/hydra/core#Operation",
                    "http://schema.org/CreateAction"
                  ],
                  "http://www.w3.org/ns/hydra/core#expects": [
                    {
                      "@id": "https://localhost/docs.jsonld#LocalizedCatalog"
                    }
                  ],
                  "http://www.w3.org/ns/hydra/core#method": [
                    { "@value": "POST" }
                  ],
                  "http://www.w3.org/ns/hydra/core#title": [
                    { "@value": "Creates a LocalizedCatalog resource." }
                  ],
                  "http://www.w3.org/2000/01/rdf-schema#label": [
                    { "@value": "Creates a LocalizedCatalog resource." }
                  ],
                  "http://www.w3.org/ns/hydra/core#returns": [
                    {
                      "@id": "https://localhost/docs.jsonld#LocalizedCatalog"
                    }
                  ]
                }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "The collection of LocalizedCatalog resources" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/ns/hydra/core#Collection" },
                {
                  "http://www.w3.org/2002/07/owl#equivalentClass": [
                    {
                      "http://www.w3.org/2002/07/owl#allValuesFrom": [
                        {
                          "@id": "https://localhost/docs.jsonld#LocalizedCatalog"
                        }
                      ],
                      "http://www.w3.org/2002/07/owl#onProperty": [
                        { "@id": "http://www.w3.org/ns/hydra/core#member" }
                      ]
                    }
                  ]
                }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "The collection of LocalizedCatalog resources" }
          ],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": false }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#Entrypoint/facetConfiguration",
              "@type": ["http://www.w3.org/ns/hydra/core#Link"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#Entrypoint" }
              ],
              "http://www.w3.org/ns/hydra/core#supportedOperation": [
                {
                  "@type": [
                    "http://www.w3.org/ns/hydra/core#Operation",
                    "http://schema.org/FindAction"
                  ],
                  "http://www.w3.org/ns/hydra/core#method": [
                    { "@value": "GET" }
                  ],
                  "http://www.w3.org/ns/hydra/core#title": [
                    {
                      "@value": "Retrieves the collection of FacetConfiguration resources."
                    }
                  ],
                  "http://www.w3.org/2000/01/rdf-schema#label": [
                    {
                      "@value": "Retrieves the collection of FacetConfiguration resources."
                    }
                  ],
                  "http://www.w3.org/ns/hydra/core#returns": [
                    { "@id": "http://www.w3.org/ns/hydra/core#Collection" }
                  ]
                }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                {
                  "@value": "The collection of FacetConfiguration resources"
                }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/ns/hydra/core#Collection" },
                {
                  "http://www.w3.org/2002/07/owl#equivalentClass": [
                    {
                      "http://www.w3.org/2002/07/owl#allValuesFrom": [
                        {
                          "@id": "https://localhost/docs.jsonld#FacetConfiguration"
                        }
                      ],
                      "http://www.w3.org/2002/07/owl#onProperty": [
                        { "@id": "http://www.w3.org/ns/hydra/core#member" }
                      ]
                    }
                  ]
                }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "The collection of FacetConfiguration resources" }
          ],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": false }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#Entrypoint/category",
              "@type": ["http://www.w3.org/ns/hydra/core#Link"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#Entrypoint" }
              ],
              "http://www.w3.org/ns/hydra/core#supportedOperation": [
                {
                  "@type": [
                    "http://www.w3.org/ns/hydra/core#Operation",
                    "http://schema.org/FindAction"
                  ],
                  "http://www.w3.org/ns/hydra/core#method": [
                    { "@value": "GET" }
                  ],
                  "http://www.w3.org/ns/hydra/core#title": [
                    {
                      "@value": "Retrieves the collection of Category resources."
                    }
                  ],
                  "http://www.w3.org/2000/01/rdf-schema#label": [
                    {
                      "@value": "Retrieves the collection of Category resources."
                    }
                  ],
                  "http://www.w3.org/ns/hydra/core#returns": [
                    { "@id": "http://www.w3.org/ns/hydra/core#Collection" }
                  ]
                },
                {
                  "@type": [
                    "http://www.w3.org/ns/hydra/core#Operation",
                    "http://schema.org/CreateAction"
                  ],
                  "http://www.w3.org/ns/hydra/core#expects": [
                    { "@id": "https://localhost/docs.jsonld#Category" }
                  ],
                  "http://www.w3.org/ns/hydra/core#method": [
                    { "@value": "POST" }
                  ],
                  "http://www.w3.org/ns/hydra/core#title": [
                    { "@value": "Creates a Category resource." }
                  ],
                  "http://www.w3.org/2000/01/rdf-schema#label": [
                    { "@value": "Creates a Category resource." }
                  ],
                  "http://www.w3.org/ns/hydra/core#returns": [
                    { "@id": "https://localhost/docs.jsonld#Category" }
                  ]
                }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "The collection of Category resources" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/ns/hydra/core#Collection" },
                {
                  "http://www.w3.org/2002/07/owl#equivalentClass": [
                    {
                      "http://www.w3.org/2002/07/owl#allValuesFrom": [
                        { "@id": "https://localhost/docs.jsonld#Category" }
                      ],
                      "http://www.w3.org/2002/07/owl#onProperty": [
                        { "@id": "http://www.w3.org/ns/hydra/core#member" }
                      ]
                    }
                  ]
                }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "The collection of Category resources" }
          ],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": false }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#Entrypoint/categorySortingOption",
              "@type": ["http://www.w3.org/ns/hydra/core#Link"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#Entrypoint" }
              ],
              "http://www.w3.org/ns/hydra/core#supportedOperation": [
                {
                  "@type": [
                    "http://www.w3.org/ns/hydra/core#Operation",
                    "http://schema.org/FindAction"
                  ],
                  "http://www.w3.org/ns/hydra/core#method": [
                    { "@value": "GET" }
                  ],
                  "http://www.w3.org/ns/hydra/core#title": [
                    {
                      "@value": "Retrieves the collection of CategorySortingOption resources."
                    }
                  ],
                  "http://www.w3.org/2000/01/rdf-schema#label": [
                    {
                      "@value": "Retrieves the collection of CategorySortingOption resources."
                    }
                  ],
                  "http://www.w3.org/ns/hydra/core#returns": [
                    { "@id": "http://www.w3.org/ns/hydra/core#Collection" }
                  ]
                }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                {
                  "@value": "The collection of CategorySortingOption resources"
                }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/ns/hydra/core#Collection" },
                {
                  "http://www.w3.org/2002/07/owl#equivalentClass": [
                    {
                      "http://www.w3.org/2002/07/owl#allValuesFrom": [
                        {
                          "@id": "https://localhost/docs.jsonld#CategorySortingOption"
                        }
                      ],
                      "http://www.w3.org/2002/07/owl#onProperty": [
                        { "@id": "http://www.w3.org/ns/hydra/core#member" }
                      ]
                    }
                  ]
                }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "The collection of CategorySortingOption resources" }
          ],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": false }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#Entrypoint/categoryConfiguration",
              "@type": ["http://www.w3.org/ns/hydra/core#Link"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#Entrypoint" }
              ],
              "http://www.w3.org/ns/hydra/core#supportedOperation": [
                {
                  "@type": [
                    "http://www.w3.org/ns/hydra/core#Operation",
                    "http://schema.org/FindAction"
                  ],
                  "http://www.w3.org/ns/hydra/core#method": [
                    { "@value": "GET" }
                  ],
                  "http://www.w3.org/ns/hydra/core#title": [
                    {
                      "@value": "Retrieves the collection of CategoryConfiguration resources."
                    }
                  ],
                  "http://www.w3.org/2000/01/rdf-schema#label": [
                    {
                      "@value": "Retrieves the collection of CategoryConfiguration resources."
                    }
                  ],
                  "http://www.w3.org/ns/hydra/core#returns": [
                    { "@id": "http://www.w3.org/ns/hydra/core#Collection" }
                  ]
                },
                {
                  "@type": [
                    "http://www.w3.org/ns/hydra/core#Operation",
                    "http://schema.org/CreateAction"
                  ],
                  "http://www.w3.org/ns/hydra/core#expects": [
                    {
                      "@id": "https://localhost/docs.jsonld#CategoryConfiguration"
                    }
                  ],
                  "http://www.w3.org/ns/hydra/core#method": [
                    { "@value": "POST" }
                  ],
                  "http://www.w3.org/ns/hydra/core#title": [
                    { "@value": "Creates a CategoryConfiguration resource." }
                  ],
                  "http://www.w3.org/2000/01/rdf-schema#label": [
                    { "@value": "Creates a CategoryConfiguration resource." }
                  ],
                  "http://www.w3.org/ns/hydra/core#returns": [
                    {
                      "@id": "https://localhost/docs.jsonld#CategoryConfiguration"
                    }
                  ]
                }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                {
                  "@value": "The collection of CategoryConfiguration resources"
                }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/ns/hydra/core#Collection" },
                {
                  "http://www.w3.org/2002/07/owl#equivalentClass": [
                    {
                      "http://www.w3.org/2002/07/owl#allValuesFrom": [
                        {
                          "@id": "https://localhost/docs.jsonld#CategoryConfiguration"
                        }
                      ],
                      "http://www.w3.org/2002/07/owl#onProperty": [
                        { "@id": "http://www.w3.org/ns/hydra/core#member" }
                      ]
                    }
                  ]
                }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "The collection of CategoryConfiguration resources" }
          ],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": false }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#Entrypoint/exampleDocument",
              "@type": ["http://www.w3.org/ns/hydra/core#Link"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#Entrypoint" }
              ],
              "http://www.w3.org/ns/hydra/core#supportedOperation": [
                {
                  "@type": [
                    "http://www.w3.org/ns/hydra/core#Operation",
                    "http://schema.org/FindAction"
                  ],
                  "http://www.w3.org/ns/hydra/core#method": [
                    { "@value": "GET" }
                  ],
                  "http://www.w3.org/ns/hydra/core#title": [
                    {
                      "@value": "Retrieves the collection of ExampleDocument resources."
                    }
                  ],
                  "http://www.w3.org/2000/01/rdf-schema#label": [
                    {
                      "@value": "Retrieves the collection of ExampleDocument resources."
                    }
                  ],
                  "http://www.w3.org/ns/hydra/core#returns": [
                    { "@id": "http://www.w3.org/ns/hydra/core#Collection" }
                  ]
                },
                {
                  "@type": [
                    "http://www.w3.org/ns/hydra/core#Operation",
                    "http://schema.org/CreateAction"
                  ],
                  "http://www.w3.org/ns/hydra/core#expects": [
                    {
                      "@id": "https://localhost/docs.jsonld#ExampleDocument"
                    }
                  ],
                  "http://www.w3.org/ns/hydra/core#method": [
                    { "@value": "POST" }
                  ],
                  "http://www.w3.org/ns/hydra/core#title": [
                    { "@value": "Creates a ExampleDocument resource." }
                  ],
                  "http://www.w3.org/2000/01/rdf-schema#label": [
                    { "@value": "Creates a ExampleDocument resource." }
                  ],
                  "http://www.w3.org/ns/hydra/core#returns": [
                    {
                      "@id": "https://localhost/docs.jsonld#ExampleDocument"
                    }
                  ]
                }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "The collection of ExampleDocument resources" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/ns/hydra/core#Collection" },
                {
                  "http://www.w3.org/2002/07/owl#equivalentClass": [
                    {
                      "http://www.w3.org/2002/07/owl#allValuesFrom": [
                        {
                          "@id": "https://localhost/docs.jsonld#ExampleDocument"
                        }
                      ],
                      "http://www.w3.org/2002/07/owl#onProperty": [
                        { "@id": "http://www.w3.org/ns/hydra/core#member" }
                      ]
                    }
                  ]
                }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "The collection of ExampleDocument resources" }
          ],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": false }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#Entrypoint/exampleProduct",
              "@type": ["http://www.w3.org/ns/hydra/core#Link"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#Entrypoint" }
              ],
              "http://www.w3.org/ns/hydra/core#supportedOperation": [
                {
                  "@type": [
                    "http://www.w3.org/ns/hydra/core#Operation",
                    "http://schema.org/FindAction"
                  ],
                  "http://www.w3.org/ns/hydra/core#method": [
                    { "@value": "GET" }
                  ],
                  "http://www.w3.org/ns/hydra/core#title": [
                    {
                      "@value": "Retrieves the collection of ExampleProduct resources."
                    }
                  ],
                  "http://www.w3.org/2000/01/rdf-schema#label": [
                    {
                      "@value": "Retrieves the collection of ExampleProduct resources."
                    }
                  ],
                  "http://www.w3.org/ns/hydra/core#returns": [
                    { "@id": "http://www.w3.org/ns/hydra/core#Collection" }
                  ]
                }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "The collection of ExampleProduct resources" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/ns/hydra/core#Collection" },
                {
                  "http://www.w3.org/2002/07/owl#equivalentClass": [
                    {
                      "http://www.w3.org/2002/07/owl#allValuesFrom": [
                        {
                          "@id": "https://localhost/docs.jsonld#ExampleProduct"
                        }
                      ],
                      "http://www.w3.org/2002/07/owl#onProperty": [
                        { "@id": "http://www.w3.org/ns/hydra/core#member" }
                      ]
                    }
                  ]
                }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "The collection of ExampleProduct resources" }
          ],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": false }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#Entrypoint/exampleCategory",
              "@type": ["http://www.w3.org/ns/hydra/core#Link"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#Entrypoint" }
              ],
              "http://www.w3.org/ns/hydra/core#supportedOperation": [
                {
                  "@type": [
                    "http://www.w3.org/ns/hydra/core#Operation",
                    "http://schema.org/FindAction"
                  ],
                  "http://www.w3.org/ns/hydra/core#method": [
                    { "@value": "GET" }
                  ],
                  "http://www.w3.org/ns/hydra/core#title": [
                    {
                      "@value": "Retrieves the collection of ExampleCategory resources."
                    }
                  ],
                  "http://www.w3.org/2000/01/rdf-schema#label": [
                    {
                      "@value": "Retrieves the collection of ExampleCategory resources."
                    }
                  ],
                  "http://www.w3.org/ns/hydra/core#returns": [
                    { "@id": "http://www.w3.org/ns/hydra/core#Collection" }
                  ]
                },
                {
                  "@type": [
                    "http://www.w3.org/ns/hydra/core#Operation",
                    "http://schema.org/CreateAction"
                  ],
                  "http://www.w3.org/ns/hydra/core#expects": [
                    {
                      "@id": "https://localhost/docs.jsonld#ExampleCategory"
                    }
                  ],
                  "http://www.w3.org/ns/hydra/core#method": [
                    { "@value": "POST" }
                  ],
                  "http://www.w3.org/ns/hydra/core#title": [
                    { "@value": "Creates a ExampleCategory resource." }
                  ],
                  "http://www.w3.org/2000/01/rdf-schema#label": [
                    { "@value": "Creates a ExampleCategory resource." }
                  ],
                  "http://www.w3.org/ns/hydra/core#returns": [
                    {
                      "@id": "https://localhost/docs.jsonld#ExampleCategory"
                    }
                  ]
                }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "The collection of ExampleCategory resources" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/ns/hydra/core#Collection" },
                {
                  "http://www.w3.org/2002/07/owl#equivalentClass": [
                    {
                      "http://www.w3.org/2002/07/owl#allValuesFrom": [
                        {
                          "@id": "https://localhost/docs.jsonld#ExampleCategory"
                        }
                      ],
                      "http://www.w3.org/2002/07/owl#onProperty": [
                        { "@id": "http://www.w3.org/ns/hydra/core#member" }
                      ]
                    }
                  ]
                }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "The collection of ExampleCategory resources" }
          ],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": false }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#Entrypoint/exampleIndex",
              "@type": ["http://www.w3.org/ns/hydra/core#Link"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#Entrypoint" }
              ],
              "http://www.w3.org/ns/hydra/core#supportedOperation": [
                {
                  "@type": [
                    "http://www.w3.org/ns/hydra/core#Operation",
                    "http://schema.org/FindAction"
                  ],
                  "http://www.w3.org/ns/hydra/core#method": [
                    { "@value": "GET" }
                  ],
                  "http://www.w3.org/ns/hydra/core#title": [
                    {
                      "@value": "Retrieves the collection of ExampleIndex resources."
                    }
                  ],
                  "http://www.w3.org/2000/01/rdf-schema#label": [
                    {
                      "@value": "Retrieves the collection of ExampleIndex resources."
                    }
                  ],
                  "http://www.w3.org/ns/hydra/core#returns": [
                    { "@id": "http://www.w3.org/ns/hydra/core#Collection" }
                  ]
                },
                {
                  "@type": [
                    "http://www.w3.org/ns/hydra/core#Operation",
                    "http://schema.org/CreateAction"
                  ],
                  "http://www.w3.org/ns/hydra/core#expects": [
                    { "@id": "https://localhost/docs.jsonld#ExampleIndex" }
                  ],
                  "http://www.w3.org/ns/hydra/core#method": [
                    { "@value": "POST" }
                  ],
                  "http://www.w3.org/ns/hydra/core#title": [
                    { "@value": "Creates a ExampleIndex resource." }
                  ],
                  "http://www.w3.org/2000/01/rdf-schema#label": [
                    { "@value": "Creates a ExampleIndex resource." }
                  ],
                  "http://www.w3.org/ns/hydra/core#returns": [
                    { "@id": "https://localhost/docs.jsonld#ExampleIndex" }
                  ]
                }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "The collection of ExampleIndex resources" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/ns/hydra/core#Collection" },
                {
                  "http://www.w3.org/2002/07/owl#equivalentClass": [
                    {
                      "http://www.w3.org/2002/07/owl#allValuesFrom": [
                        {
                          "@id": "https://localhost/docs.jsonld#ExampleIndex"
                        }
                      ],
                      "http://www.w3.org/2002/07/owl#onProperty": [
                        { "@id": "http://www.w3.org/ns/hydra/core#member" }
                      ]
                    }
                  ]
                }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "The collection of ExampleIndex resources" }
          ],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": false }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#Entrypoint/declarativeGreeting",
              "@type": ["http://www.w3.org/ns/hydra/core#Link"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                { "@id": "https://localhost/docs.jsonld#Entrypoint" }
              ],
              "http://www.w3.org/ns/hydra/core#supportedOperation": [
                {
                  "@type": [
                    "http://www.w3.org/ns/hydra/core#Operation",
                    "http://schema.org/FindAction"
                  ],
                  "http://www.w3.org/ns/hydra/core#method": [
                    { "@value": "GET" }
                  ],
                  "http://www.w3.org/ns/hydra/core#title": [
                    {
                      "@value": "Retrieves the collection of DeclarativeGreeting resources."
                    }
                  ],
                  "http://www.w3.org/2000/01/rdf-schema#label": [
                    {
                      "@value": "Retrieves the collection of DeclarativeGreeting resources."
                    }
                  ],
                  "http://www.w3.org/ns/hydra/core#returns": [
                    { "@id": "http://www.w3.org/ns/hydra/core#Collection" }
                  ]
                },
                {
                  "@type": [
                    "http://www.w3.org/ns/hydra/core#Operation",
                    "http://schema.org/CreateAction"
                  ],
                  "http://www.w3.org/ns/hydra/core#expects": [
                    { "@id": "https://localhost/Declarative Greeting" }
                  ],
                  "http://www.w3.org/ns/hydra/core#method": [
                    { "@value": "POST" }
                  ],
                  "http://www.w3.org/ns/hydra/core#title": [
                    { "@value": "Creates a DeclarativeGreeting resource." }
                  ],
                  "http://www.w3.org/2000/01/rdf-schema#label": [
                    { "@value": "Creates a DeclarativeGreeting resource." }
                  ],
                  "http://www.w3.org/ns/hydra/core#returns": [
                    { "@id": "https://localhost/Declarative Greeting" }
                  ]
                }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                {
                  "@value": "The collection of DeclarativeGreeting resources"
                }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/ns/hydra/core#Collection" },
                {
                  "http://www.w3.org/2002/07/owl#equivalentClass": [
                    {
                      "http://www.w3.org/2002/07/owl#allValuesFrom": [
                        { "@id": "https://localhost/Declarative Greeting" }
                      ],
                      "http://www.w3.org/2002/07/owl#onProperty": [
                        { "@id": "http://www.w3.org/ns/hydra/core#member" }
                      ]
                    }
                  ]
                }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "The collection of DeclarativeGreeting resources" }
          ],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": false }]
        }
      ],
      "http://www.w3.org/ns/hydra/core#title": [
        { "@value": "The API entrypoint" }
      ]
    },
    {
      "@id": "https://localhost/docs.jsonld#ConstraintViolation",
      "@type": ["http://www.w3.org/ns/hydra/core#Class"],
      "http://www.w3.org/ns/hydra/core#supportedProperty": [
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#description": [
            { "@value": "The property path of the violation" }
          ],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#ConstraintViolation/propertyPath",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                {
                  "@id": "https://localhost/docs.jsonld#ConstraintViolation"
                }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#string" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "propertyPath" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#title": [
            { "@value": "propertyPath" }
          ],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": false }]
        },
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#description": [
            { "@value": "The message associated with the violation" }
          ],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#ConstraintViolation/message",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                {
                  "@id": "https://localhost/docs.jsonld#ConstraintViolation"
                }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                { "@id": "http://www.w3.org/2001/XMLSchema#string" }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "message" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#title": [{ "@value": "message" }],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": false }]
        }
      ],
      "http://www.w3.org/ns/hydra/core#title": [
        { "@value": "A constraint violation" }
      ]
    },
    {
      "@id": "https://localhost/docs.jsonld#ConstraintViolationList",
      "@type": ["http://www.w3.org/ns/hydra/core#Class"],
      "http://www.w3.org/ns/hydra/core#supportedProperty": [
        {
          "@type": ["http://www.w3.org/ns/hydra/core#SupportedProperty"],
          "http://www.w3.org/ns/hydra/core#description": [
            { "@value": "The violations" }
          ],
          "http://www.w3.org/ns/hydra/core#property": [
            {
              "@id": "https://localhost/docs.jsonld#ConstraintViolationList/violations",
              "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
              "http://www.w3.org/2000/01/rdf-schema#domain": [
                {
                  "@id": "https://localhost/docs.jsonld#ConstraintViolationList"
                }
              ],
              "http://www.w3.org/2000/01/rdf-schema#range": [
                {
                  "@id": "https://localhost/docs.jsonld#ConstraintViolation"
                }
              ],
              "http://www.w3.org/2000/01/rdf-schema#label": [
                { "@value": "violations" }
              ]
            }
          ],
          "http://www.w3.org/ns/hydra/core#readable": [{ "@value": true }],
          "http://www.w3.org/ns/hydra/core#title": [{ "@value": "violations" }],
          "http://www.w3.org/ns/hydra/core#writeable": [{ "@value": false }]
        }
      ],
      "http://www.w3.org/ns/hydra/core#title": [
        { "@value": "A constraint violation list" }
      ],
      "http://www.w3.org/2000/01/rdf-schema#subClassOf": [
        { "@id": "http://www.w3.org/ns/hydra/core#Error" }
      ]
    }
  ],
  "http://www.w3.org/ns/hydra/core#title": [{ "@value": "Elasticsuite API" }]
};
var expandedDocsEntrypoint = expandedDocs["http://www.w3.org/ns/hydra/core#supportedClass"][24];
var expandedProperty = expandedDocsEntrypoint["http://www.w3.org/ns/hydra/core#supportedProperty"][5]["http://www.w3.org/ns/hydra/core#property"][0];
var expandedRange = expandedProperty["http://www.w3.org/2000/01/rdf-schema#range"];

// src/mocks/rules.ts
var complexRule = {
  type: "combination",
  operator: "all",
  value: "true",
  children: [
    {
      type: "combination",
      operator: "any",
      value: "true",
      children: [
        {
          type: "attribute",
          field: "color",
          operator: "is_one_of",
          attribute_type: "float",
          value: "35"
        },
        {
          type: "attribute",
          field: "attribut set",
          operator: "is",
          attribute_type: "select",
          value: "music accesories"
        },
        {
          type: "attribute",
          field: "age",
          operator: "is",
          attribute_type: "number",
          value: "6-9 years old"
        },
        {
          type: "combination",
          operator: "any",
          value: "true",
          children: [
            {
              type: "attribute",
              field: "color",
              operator: "is_one_of",
              attribute_type: "select",
              value: "rouge"
            },
            {
              type: "attribute",
              field: "attribut set",
              operator: "is",
              attribute_type: "select",
              value: "music accesories"
            },
            {
              type: "attribute",
              field: "age",
              operator: "is",
              attribute_type: "select",
              value: "6-9 years old"
            }
          ]
        }
      ]
    },
    {
      type: "combination",
      operator: "any",
      value: "true",
      children: [
        {
          type: "attribute",
          field: "color",
          operator: "is_one_of",
          attribute_type: "select",
          value: "rouge"
        },
        {
          type: "attribute",
          field: "attribut set",
          operator: "is",
          attribute_type: "select",
          value: "music accesories"
        },
        {
          type: "attribute",
          field: "age",
          operator: "is",
          attribute_type: "select",
          value: "6-9 years old"
        }
      ]
    }
  ]
};
var attributeRule = complexRule.children[0].children[0];
var combinationRule = complexRule.children[0].children[3];

// src/services/fetch.ts
function isFetchError(json) {
  return "error" in json;
}
function normalizeUrl(url2 = "") {
  if (process.env.NEXT_PUBLIC_LOCAL) {
    try {
      const urlObj = new URL(url2);
      if (urlObj.origin === apiUrl) {
        if (urlObj.pathname === "/") {
          urlObj.pathname = "/index";
        }
        if (urlObj.pathname && !urlObj.pathname.endsWith(".json") && !urlObj.pathname.endsWith(".jsonld")) {
          urlObj.pathname = `${urlObj.pathname}.json`;
        }
        if (urlObj.pathname.endsWith(".jsonld")) {
          urlObj.pathname = `${urlObj.pathname.slice(0, -7)}.json`;
        }
        if (!urlObj.pathname.startsWith("/mocks")) {
          urlObj.pathname = `/mocks${urlObj.pathname}`;
        }
        url2 = urlObj.href;
      }
    } catch (error) {
    }
  }
  return url2;
}
async function fetchJson(url2, options = {}) {
  if (!options.method || options.method === "GET" /* GET */) {
    url2 = normalizeUrl(url2.toString());
  }
  const response = await fetch(url2, options);
  const json = await response.json();
  return { json, response };
}

// src/services/storage.ts
function storageGet(key) {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key);
  }
}
function storageSet(key, value) {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, value);
  }
}
function storageRemove(key) {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key);
  }
}

// src/services/url.ts
function getUrl(urlParam, searchParameters = {}) {
  const url2 = urlParam instanceof URL ? urlParam : new URL(urlParam);
  Object.entries(searchParameters).forEach(([key, value]) => {
    if (value instanceof Array) {
      value.forEach((value2) => url2.searchParams.append(key, String(value2)));
    } else {
      url2.searchParams.append(key, String(value));
    }
  });
  return url2;
}
function clearParameters(url2) {
  ;
  [...url2.searchParams.entries()].forEach(
    ([key]) => url2.searchParams.delete(key)
  );
  return url2;
}
function getListParameters(page = 0, searchParameters = {}, searchValue = "") {
  if (typeof page === "number") {
    return removeEmptyParameters({
      ...searchParameters,
      [currentPage]: page === 0 ? "" : page,
      [searchParameter]: searchValue
    });
  }
  return removeEmptyParameters({
    ...searchParameters,
    [searchParameter]: searchValue
  });
}
function getListApiParameters(page = 0, rowsPerPage = defaultPageSize, searchParameters = {}, searchValue = "") {
  if (typeof page === "number") {
    return removeEmptyParameters({
      ...searchParameters,
      [currentPage]: page + 1,
      [usePagination]: true,
      [pageSize]: rowsPerPage,
      [searchParameter]: searchValue
    });
  }
  return removeEmptyParameters({
    ...searchParameters,
    [usePagination]: false,
    [searchParameter]: searchValue
  });
}
function getRouterUrl(path) {
  return new URL(`${window.location.origin}${path}`);
}
function getRouterPath(path) {
  const url2 = getRouterUrl(path);
  return clearParameters(url2).pathname;
}
function getAppUrl(path, page = 0, activeFilters, searchValue) {
  const parameters = getListParameters(page, activeFilters, searchValue);
  const url2 = getRouterUrl(path);
  return getUrl(clearParameters(url2), parameters);
}
function getParametersFromUrl(url2) {
  return Object.fromEntries(
    [...url2.searchParams.entries()].reduce((acc, [key, value]) => {
      var _a;
      if (key.endsWith("[]")) {
        const existingValue = (_a = acc.find(([accKey]) => accKey === key)) == null ? void 0 : _a[1];
        if (existingValue) {
          existingValue.push(value);
        } else {
          acc.push([key, [value]]);
        }
      } else {
        acc.push([key, value]);
      }
      return acc;
    }, [])
  );
}
function getPageParameter(parameters) {
  const pageEntry = Object.entries(parameters).find(
    ([key]) => key === currentPage
  );
  return Number(_nullishCoalesce((pageEntry == null ? void 0 : pageEntry[1]), () => ( 0)));
}
function getSearchParameter(parameters) {
  const pageEntry = Object.entries(parameters).find(
    ([key]) => key === searchParameter
  );
  return String(_nullishCoalesce((pageEntry == null ? void 0 : pageEntry[1]), () => ( "")));
}

// src/services/api.ts
var ApiError = class extends Error {
};
var AuthError = class extends Error {
};
function isApiError(json) {
  return "code" in json && "message" in json;
}
function getApiUrl(url2 = "") {
  if (!url2.startsWith("http")) {
    if (!url2.startsWith("/")) {
      url2 = `/${url2}`;
    }
    url2 = `${apiUrl}${url2}`;
  }
  return url2;
}
function fetchApi(language, resource2, searchParameters = {}, options = {}, secure = true) {
  const apiUrl2 = typeof resource2 === "string" ? getApiUrl(resource2) : getApiUrl(resource2.url);
  const headers = {
    [languageHeader]: language,
    [contentTypeHeader]: "application/json",
    ...options.headers
  };
  const token = storageGet(tokenStorageKey);
  if (secure && token) {
    headers[authHeader] = `Bearer ${token}`;
  }
  return fetchJson(getUrl(apiUrl2, searchParameters).href, {
    ...options,
    headers
  }).then(({ json, response }) => {
    if (isApiError(json)) {
      storageRemove(tokenStorageKey);
      throw new ApiError(json.message);
    } else if (authErrorCodes.includes(response.status)) {
      storageRemove(tokenStorageKey);
      throw new AuthError("Unauthorized/Forbidden");
    }
    return json;
  });
}
function removeEmptyParameters(searchParameters = {}) {
  return Object.fromEntries(
    Object.entries(searchParameters).filter(
      ([_, value]) => (_nullishCoalesce(value, () => ( ""))) !== ""
    )
  );
}
function log(log2, error) {
  if (process.env.NODE_ENV === "development" || typeof window !== "undefined" && window.showErrors === true) {
    console.error(error);
  }
  log2(error.message);
}

// src/services/breadcrumb.ts
function getSlugArray(data) {
  if (typeof data === "string") {
    return [data];
  }
  const newBreadCrumbData = [data[0]];
  for (let index = 0; index < data.length - 1; index++) {
    newBreadCrumbData.push(`${newBreadCrumbData[index]}_${data[index + 1]}`);
  }
  return newBreadCrumbData;
}
function findBreadcrumbLabel(findIndex, slug, menu, deepIndex = 0) {
  if (typeof menu === "object") {
    for (const menuChild in menu) {
      if (menu[menuChild].code === slug[deepIndex]) {
        if (findIndex === deepIndex) {
          return menu[menuChild].label;
        }
        return findBreadcrumbLabel(
          findIndex,
          slug,
          menu[menuChild].children,
          deepIndex + 1
        );
      }
    }
  }
  return null;
}

// src/services/catalog.ts
function findDefaultCatalog(catalogsData) {
  const defaultCatalog = catalogsData ? catalogsData.filter(
    (catalog) => catalog.localizedCatalogs.find((localizedCtl) => localizedCtl.isDefault)
  )[0] : null;
  if (defaultCatalog) {
    defaultCatalog.localizedCatalogs = defaultCatalog.localizedCatalogs.filter(
      (localizedCtl) => localizedCtl.isDefault
    );
  }
  return defaultCatalog ? defaultCatalog : null;
}
function getCatalogForSearchProductApi(catalog, localizedCatalog, catalogsData) {
  if (catalog === -1) {
    const defaultCatalog = findDefaultCatalog(catalogsData);
    return defaultCatalog ? defaultCatalog.localizedCatalogs[0].id.toString() : "";
  } else if (catalog !== -1 && localizedCatalog === -1) {
    return catalogsData.filter((ctl) => ctl.id === catalog).map((ctl) => ctl.localizedCatalogs[0].id).flat()[0].toString();
  }
  return localizedCatalog.toString();
}

// src/services/field.ts
function updateProperties(properties, key, value) {
  if (key === "visible") {
    return {
      ...properties,
      visible: value
    };
  } else if (key === "editable") {
    return {
      ...properties,
      editable: value
    };
  } else if (key === "position") {
    return {
      ...properties,
      position: value
    };
  }
  return properties;
}
function updatePropertiesAccordingToPath(field, path) {
  var _a, _b;
  if (path.includes("admin/settings")) {
    path = "settings_attribute";
  } else {
    path = path.replaceAll("/", "_").replace("_admin_", "");
  }
  if ((_a = field.elasticsuite) == null ? void 0 : _a.context) {
    const [, newPropertiesvalues] = Object.entries((_b = field.elasticsuite) == null ? void 0 : _b.context).filter(([key, _]) => key === path).flat();
    if (newPropertiesvalues) {
      let newProperties = field.elasticsuite;
      Object.entries(newPropertiesvalues).forEach(
        ([property, propertyValue]) => newProperties = updateProperties(
          newProperties,
          property,
          propertyValue
        )
      );
      return {
        ...field,
        elasticsuite: newProperties
      };
    }
  }
  return field;
}
function hasFieldOptions(field) {
  var _a;
  return Boolean((_a = field.elasticsuite) == null ? void 0 : _a.options);
}
function isDropdownStaticOptions(options) {
  return "values" in options;
}

// src/services/format.ts
var _inflection = require('inflection'); var _inflection2 = _interopRequireDefault(_inflection);
function firstLetterUppercase(item) {
  return item[0].toUpperCase() + item.slice(1);
}
function firstLetterLowercase(item) {
  return item[0].toLowerCase() + item.slice(1);
}
function humanize(label) {
  return _inflection2.default.transform(label, ["underscore", "humanize"]);
}
function getFieldLabelTranslationArgs(source, resource2) {
  const { sourceWithoutDigits, sourceSuffix } = getSourceParts(source);
  const defaultLabel = humanize(sourceSuffix.replace(/\./g, " "));
  if (resource2) {
    return [`resources.${resource2}.fields.${sourceWithoutDigits}`, defaultLabel];
  }
  return [`fields.${sourceWithoutDigits}`, defaultLabel];
}
function getSourceParts(source) {
  const sourceWithoutDigits = source.replace(/\.\d+\./g, ".");
  const parts = source.split(".");
  let lastPartWithDigits;
  parts.forEach((part, index) => {
    if (onlyDigits(part)) {
      lastPartWithDigits = index;
    }
  });
  const sourceSuffix = lastPartWithDigits !== null && typeof lastPartWithDigits !== "undefined" ? parts.slice(lastPartWithDigits + 1).join(".") : source;
  return { sourceWithoutDigits, sourceSuffix };
}
function onlyDigits(s) {
  for (let i = s.length - 1; i >= 0; i--) {
    const d = s.charCodeAt(i);
    if (d < 48 || d > 57)
      return false;
  }
  return true;
}
function formatPrice(price, currency, countryCode) {
  return new Intl.NumberFormat(countryCode, {
    style: "currency",
    currency: `${currency}`
  }).format(price);
}

// src/services/hydra.ts
function getResource(api2, resourceName) {
  return api2.find(
    (resource2) => resource2.title === resourceName || resource2.label === resourceName
  );
}
function getFieldName(property) {
  if (property.endsWith("[]")) {
    return property.slice(0, -2);
  }
  return property;
}
function getField(resource2, name) {
  name = getFieldName(name);
  return resource2.supportedProperty.find((field) => {
    return field.title === name;
  });
}
function getFieldType(field) {
  var _a;
  switch ((_a = field.property) == null ? void 0 : _a.range["@id"]) {
    case "http://www.w3.org/2001/XMLSchema#array":
      return "array";
    case "http://www.w3.org/2001/XMLSchema#integer":
      return "integer";
    case "http://www.w3.org/2001/XMLSchema#decimal":
    case "http://www.w3.org/2001/XMLSchema#float":
      return "float";
    case "http://www.w3.org/2001/XMLSchema#boolean":
      return "boolean";
    case "http://www.w3.org/2001/XMLSchema#date":
      return "date";
    case "http://www.w3.org/2001/XMLSchema#dateTime":
      return "dateTime";
    default:
      return "text";
  }
}
function isReferenceField(field) {
  return field.property["@type"] === "http://www.w3.org/ns/hydra/core#Link";
}
function getReferencedResource(api2, field) {
  return api2.find((resource2) => resource2["@id"] === field.property.range["@id"]);
}
function getOptionsFromResource(response) {
  return response["hydra:member"].map((member) => ({
    id: member.id,
    label: member["@id"],
    value: member.id
  }));
}
function getOptionsFromLabelResource(response) {
  return response["hydra:member"].map((member) => ({
    id: member.id,
    label: member.label,
    value: member.id
  }));
}
function getOptionsFromApiSchema(response) {
  return response["hydra:member"].map((member) => ({
    id: member.code,
    label: member.label,
    value: member.code
  }));
}
function castFieldParameter(field, value) {
  if (value instanceof Array) {
    return value.map(
      (value2) => castFieldParameter(field, value2)
    );
  }
  if (isReferenceField(field)) {
    return Number(value);
  }
  switch (getFieldType(field)) {
    case "integer":
      return Number(value);
    case "boolean":
      return value !== "true" && value !== "false" ? null : value === "true";
    default:
      return value;
  }
}
function isFieldValueValid(field, value) {
  if (value instanceof Array) {
    return value.every((value2) => isFieldValueValid(field, value2));
  }
  if (isReferenceField(field)) {
    return typeof value === "number" && !isNaN(value);
  }
  switch (getFieldType(field)) {
    case "integer":
      return typeof value === "number" && !isNaN(value);
    case "boolean":
      return typeof value === "boolean";
    default:
      return typeof value === "string";
  }
}
function getFilterParameters(resource2, parameters) {
  return Object.fromEntries(
    Object.entries(parameters).reduce((acc, [key, value]) => {
      const field = getField(resource2, key);
      if (field) {
        const fieldValue = castFieldParameter(field, value);
        if (isFieldValueValid(field, fieldValue)) {
          acc.push([key, fieldValue]);
        }
      }
      return acc;
    }, [])
  );
}

// src/services/local.ts
function getUniqueLocalName(data) {
  const languages = data.localizedCatalogs.map((item) => item.localName);
  return [...new Set(languages)];
}

// src/services/options.ts
function getOptionsFromEnum(enumObject, t) {
  return Object.entries(enumObject).map(([key, value]) => ({
    value,
    label: t(key)
  }));
}

// src/services/parser.ts
var _jsonld = require('jsonld'); var _jsonld2 = _interopRequireDefault(_jsonld);
function getDocumentationUrlFromHeaders(headers) {
  const linkHeader = headers.get("Link");
  if (linkHeader) {
    const matches = headerRegexp.exec(linkHeader);
    return matches[1];
  }
}
async function fetchDocs(apiUrl2) {
  const { json: entrypoint, response } = await fetchJson(apiUrl2);
  const docsUrl = getDocumentationUrlFromHeaders(response.headers);
  const { json: docs } = await fetchJson(docsUrl);
  const [expandedDoc, expandedEntrypoint2] = await Promise.all([
    _jsonld2.default.expand(docs, { base: docsUrl }),
    _jsonld2.default.expand(entrypoint, { base: apiUrl2 })
  ]);
  return {
    docs: expandedDoc[0],
    docsUrl,
    entrypoint: expandedEntrypoint2[0],
    entrypointUrl: apiUrl2
  };
}
function getSupportedClassMap(jsonld2) {
  return new Map(
    jsonld2["http://www.w3.org/ns/hydra/core#supportedClass"].map(
      (supportedClass) => [supportedClass["@id"], supportedClass]
    )
  );
}
function isIJsonldRange(range) {
  return "http://www.w3.org/2002/07/owl#equivalentClass" in range;
}
function findRelatedClass(supportedClassMap, property) {
  if (property["http://www.w3.org/2000/01/rdf-schema#range"] instanceof Array) {
    for (const range of property["http://www.w3.org/2000/01/rdf-schema#range"]) {
      if (isIJsonldRange(range)) {
        const onProperty = range["http://www.w3.org/2002/07/owl#equivalentClass"][0]["http://www.w3.org/2002/07/owl#onProperty"][0]["@id"];
        const allValuesFrom = range["http://www.w3.org/2002/07/owl#equivalentClass"][0]["http://www.w3.org/2002/07/owl#allValuesFrom"][0]["@id"];
        if (allValuesFrom && onProperty === "http://www.w3.org/ns/hydra/core#member") {
          return supportedClassMap.get(allValuesFrom);
        }
      }
    }
  }
  for (const entrypointSupportedOperation of property["http://www.w3.org/ns/hydra/core#supportedOperation"] || []) {
    if (!entrypointSupportedOperation["http://www.w3.org/ns/hydra/core#returns"]) {
      continue;
    }
    const returns = entrypointSupportedOperation["http://www.w3.org/ns/hydra/core#returns"][0]["@id"];
    if ("string" === typeof returns && returns.indexOf("http://www.w3.org/ns/hydra/core") !== 0) {
      return supportedClassMap.get(returns);
    }
  }
}
function simplifyJsonldObject(property) {
  if ("@value" in property) {
    return property["@value"];
  }
  return Object.fromEntries(
    Object.entries(property).map(([key, value]) => {
      const name = key.substring(key.lastIndexOf("#") + 1);
      if (!(value instanceof Array)) {
        if (!(value instanceof Object)) {
          return [name, value];
        }
        return [name, simplifyJsonldObject(value)];
      }
      if (value.length === 1) {
        if (!(value[0] instanceof Object)) {
          return [name, value[0]];
        }
        return [name, simplifyJsonldObject(value[0])];
      }
      if (!(value[0] instanceof Object)) {
        return [name, value];
      }
      return [name, value.map(simplifyJsonldObject)];
    })
  );
}
async function parseSchema(apiUrl2) {
  const { docs, entrypoint } = await fetchDocs(apiUrl2);
  const supportedClassMap = getSupportedClassMap(docs);
  const entrypointClass = supportedClassMap.get(entrypoint["@type"][0]);
  let resources2 = [];
  if (entrypointClass) {
    resources2 = entrypointClass["http://www.w3.org/ns/hydra/core#supportedProperty"].reduce((acc, supportedProperty) => {
      if (supportedProperty["http://www.w3.org/ns/hydra/core#property"][0]) {
        const [property] = supportedProperty["http://www.w3.org/ns/hydra/core#property"];
        const relatedClass = findRelatedClass(supportedClassMap, property);
        if (relatedClass && entrypoint[property["@id"]]) {
          const resource2 = simplifyJsonldObject({
            ...relatedClass,
            "http://www.w3.org/ns/hydra/core#supportedOperation": [
              ...property["http://www.w3.org/ns/hydra/core#supportedOperation"],
              ...relatedClass["http://www.w3.org/ns/hydra/core#supportedOperation"]
            ]
          });
          const [entrypointUrl] = entrypoint[property["@id"]];
          acc.push({
            ...resource2,
            url: typeof entrypointUrl === "string" ? entrypointUrl : entrypointUrl["@id"]
          });
        }
      }
      return acc;
    }, []);
  }
  return resources2;
}

// src/services/rules.ts
function isCombinationRule(rule) {
  return rule.type === "combination" /* COMBINATION */;
}
function isAttributeRule(rule) {
  return rule.type === "attribute" /* ATTRIBUTE */;
}

// src/services/style.ts
function getCustomScrollBarStyles(theme2) {
  return {
    "&::-webkit-scrollbar": {
      position: "sticky",
      bottom: "150px",
      height: "4px"
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: `${theme2.palette.colors.white}`,
      top: "15px"
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: `${theme2.palette.neutral.main}`,
      borderRadius: "15px",
      top: "15px"
    }
  };
}

// src/services/table.ts
function getFieldDataContentType(field) {
  var _a;
  if ((_a = field.elasticsuite) == null ? void 0 : _a.input) {
    return field.elasticsuite.input;
  }
  const type = getFieldType(field);
  if (type === "boolean") {
    return "boolean" /* BOOLEAN */;
  }
  return "string" /* STRING */;
}
function getFieldHeader(field, t) {
  var _a;
  return {
    field,
    name: field.title,
    label: _nullishCoalesce(field.property.label, () => ( t(...getFieldLabelTranslationArgs(field.title)))),
    type: getFieldDataContentType(field),
    editable: ((_a = field.elasticsuite) == null ? void 0 : _a.editable) && field.writeable,
    required: field.required
  };
}
function getFilterType(mapping) {
  return mapping.multiple ? "dropdown" /* DROPDOWN */ : booleanRegexp.test(mapping.property) ? "boolean" /* BOOLEAN */ : "string" /* STRING */;
}
function getFilter(mapping, t) {
  const type = getFilterType(mapping);
  return {
    field: mapping.field,
    id: mapping.variable,
    label: mapping.field ? _nullishCoalesce(mapping.field.property.label, () => ( t(...getFieldLabelTranslationArgs(mapping.field.title)))) : t(...getFieldLabelTranslationArgs(mapping.property)),
    multiple: mapping.multiple,
    options: mapping.options,
    type
  };
}
function getMappings(apiData, resource2) {
  const mappings = apiData == null ? void 0 : apiData["hydra:search"]["hydra:mapping"].map((mapping) => ({
    ...mapping,
    field: getField(resource2, mapping.property),
    multiple: mapping.variable.endsWith("[]")
  })).filter((mapping) => mapping.field);
  const arrayProperties = mappings.filter((mapping) => mapping.multiple).map((mapping) => mapping.property);
  return mappings == null ? void 0 : mappings.filter((mapping) => {
    var _a;
    return (_a = mapping.field.elasticsuite) == null ? void 0 : _a.visible;
  }).filter(
    (mapping) => !arrayProperties.includes(mapping.property) || mapping.multiple
  );
}

// src/services/user.ts
function isValidUser(user) {
  return Boolean(user && Date.now() / 1e3 < user.exp);
}


























































































































exports.ApiError = ApiError; exports.AuthError = AuthError; exports.DataContentType = DataContentType; exports.HttpCode = HttpCode; exports.HydraType = HydraType; exports.LoadStatus = LoadStatus; exports.MassiveSelectionType = MassiveSelectionType; exports.Method = Method; exports.Role = Role; exports.RuleAttributeOperator = RuleAttributeOperator; exports.RuleAttributeType = RuleAttributeType; exports.RuleCombinationOperator = RuleCombinationOperator; exports.RuleType = RuleType; exports.api = api; exports.apiUrl = apiUrl; exports.attributeRule = attributeRule; exports.authErrorCodes = authErrorCodes; exports.authHeader = authHeader; exports.booleanRegexp = booleanRegexp; exports.buttonEnterKeyframe = buttonEnterKeyframe; exports.castFieldParameter = castFieldParameter; exports.clearParameters = clearParameters; exports.combinationRule = combinationRule; exports.complexRule = complexRule; exports.contentTypeHeader = contentTypeHeader; exports.currentPage = currentPage; exports.defaultPageSize = defaultPageSize; exports.defaultRowsPerPageOptions = defaultRowsPerPageOptions; exports.emptyAttributeRule = emptyAttributeRule; exports.emptyCombinationRule = emptyCombinationRule; exports.expandedDocs = expandedDocs; exports.expandedDocsEntrypoint = expandedDocsEntrypoint; exports.expandedEntrypoint = expandedEntrypoint; exports.expandedProperty = expandedProperty; exports.expandedRange = expandedRange; exports.fetchApi = fetchApi; exports.fetchDocs = fetchDocs; exports.fetchJson = fetchJson; exports.fieldBoolean = fieldBoolean; exports.fieldDropdown = fieldDropdown; exports.fieldDropdownWithApiOptions = fieldDropdownWithApiOptions; exports.fieldDropdownWithContext = fieldDropdownWithContext; exports.fieldInteger = fieldInteger; exports.fieldRef = fieldRef; exports.fieldString = fieldString; exports.findBreadcrumbLabel = findBreadcrumbLabel; exports.findDefaultCatalog = findDefaultCatalog; exports.findRelatedClass = findRelatedClass; exports.firstLetterLowercase = firstLetterLowercase; exports.firstLetterUppercase = firstLetterUppercase; exports.formatPrice = formatPrice; exports.getApiUrl = getApiUrl; exports.getAppUrl = getAppUrl; exports.getCatalogForSearchProductApi = getCatalogForSearchProductApi; exports.getCustomScrollBarStyles = getCustomScrollBarStyles; exports.getDocumentationUrlFromHeaders = getDocumentationUrlFromHeaders; exports.getField = getField; exports.getFieldDataContentType = getFieldDataContentType; exports.getFieldHeader = getFieldHeader; exports.getFieldLabelTranslationArgs = getFieldLabelTranslationArgs; exports.getFieldName = getFieldName; exports.getFieldType = getFieldType; exports.getFilter = getFilter; exports.getFilterParameters = getFilterParameters; exports.getFilterType = getFilterType; exports.getListApiParameters = getListApiParameters; exports.getListParameters = getListParameters; exports.getMappings = getMappings; exports.getOptionsFromApiSchema = getOptionsFromApiSchema; exports.getOptionsFromEnum = getOptionsFromEnum; exports.getOptionsFromLabelResource = getOptionsFromLabelResource; exports.getOptionsFromResource = getOptionsFromResource; exports.getPageParameter = getPageParameter; exports.getParametersFromUrl = getParametersFromUrl; exports.getReferencedResource = getReferencedResource; exports.getResource = getResource; exports.getRouterPath = getRouterPath; exports.getRouterUrl = getRouterUrl; exports.getSearchParameter = getSearchParameter; exports.getSlugArray = getSlugArray; exports.getSupportedClassMap = getSupportedClassMap; exports.getUniqueLocalName = getUniqueLocalName; exports.getUrl = getUrl; exports.gqlUrl = gqlUrl; exports.hasFieldOptions = hasFieldOptions; exports.headerRegexp = headerRegexp; exports.humanize = humanize; exports.isApiError = isApiError; exports.isAttributeRule = isAttributeRule; exports.isCombinationRule = isCombinationRule; exports.isDropdownStaticOptions = isDropdownStaticOptions; exports.isFetchError = isFetchError; exports.isFieldValueValid = isFieldValueValid; exports.isIJsonldRange = isIJsonldRange; exports.isReferenceField = isReferenceField; exports.isValidUser = isValidUser; exports.languageHeader = languageHeader; exports.log = log; exports.normalizeUrl = normalizeUrl; exports.operatorsByType = operatorsByType; exports.pageSize = pageSize; exports.parseSchema = parseSchema; exports.productTableheader = productTableheader; exports.productsQuery = productsQuery; exports.removeEmptyParameters = removeEmptyParameters; exports.reorderingColumnWidth = reorderingColumnWidth; exports.resource = resource; exports.resourceWithRef = resourceWithRef; exports.resources = resources; exports.searchParameter = searchParameter; exports.searchableAttributeUrl = searchableAttributeUrl; exports.selectionColumnWidth = selectionColumnWidth; exports.simplifyJsonldObject = simplifyJsonldObject; exports.stickyColunWidth = stickyColunWidth; exports.storageGet = storageGet; exports.storageRemove = storageRemove; exports.storageSet = storageSet; exports.theme = theme; exports.tokenStorageKey = tokenStorageKey; exports.updatePropertiesAccordingToPath = updatePropertiesAccordingToPath; exports.usePagination = usePagination;
