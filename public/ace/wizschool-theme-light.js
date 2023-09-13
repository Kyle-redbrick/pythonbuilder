define("ace/theme/wizschool-light", ["require", "exports", "module", "ace/lib/dom"], function (e, t, n) {
  (t.isDark = !1),
    (t.cssClass = "ace-wizschool-light"),
    (t.cssText = `
    :root {
      --wizschoolLightColor01: #ff9d19;
      --wizschoolLightColor02: #8a5cff;
      --wizschoolLightColor03: #ff5b75;
      --wizschoolLightColor04: #38b341;
      --wizschoolLightColor05: #4289ff;
      --wizschoolLightColor06: #275a5e;

      --wizschoolLightColorWH: #f8f8fa;
      --wizschoolLightColorBK: #181818;
      --wizschoolLightColorLine: rgba(0, 0, 0, 0.071);
      --wizschoolLightColorSelection: #b5d5ff;

      --wizschoolLightColorStep: #c6dbae;
      --wizschoolLightColorBracket: #bfbfbf;
      --wizschoolLightColorFold: #8e8e93;
    }

    .ace-wizschool-light {
      background-color: var(--wizschoolLightColorWH);
      color: var(--wizschoolLightColorBK);
    }
    .ace-wizschool-light .ace_gutter {
      // background: rgba(216, 216, 216, 0.2);
      color: var(--wizschoolLightColorFold);
      z-index: 0; /* temporary */
    }
    .ace-wizschool-light .ace_print-margin {
      width: 1px;
      background-color: var(--wizschoolLightColorWH);
    }
    .ace-wizschool-light .ace_cursor {
      color: var(--wizschoolLightColorBK);
    }
    .ace-wizschool-light .ace_marker-layer .ace_selection {
      background: var(--wizschoolLightColorSelection);
    }
    .ace-wizschool-light.ace_multiselect .ace_selection.ace_start {
      box-shadow: 0 0 3px 0px var(--wizschoolLightColorWH);
    }
    .ace-wizschool-light .ace_marker-layer .ace_step {
      background: var(--wizschoolLightColorStep);
    }
    .ace-wizschool-light .ace_marker-layer .ace_bracket {
      margin: -1px 0 0 -1px;
      border: 1px solid var(--wizschoolLightColorBracket);
    }
    .ace-wizschool-light .ace_marker-layer .ace_active-line {
      background: var(--wizschoolLightColorLine);
    }
    .ace-wizschool-light .ace_gutter-active-line {
      background-color: var(--wizschoolLightColorLine);
    }
    .ace-wizschool-light .ace_marker-layer .ace_selected-word {
      border: 1px solid var(--wizschoolLightColorSelection);
    }
    .ace-wizschool-light .ace_constant.ace_language,
    .ace-wizschool-light .ace_keyword,
    .ace-wizschool-light .ace_meta,
    .ace-wizschool-light .ace_variable.ace_language {
      color: var(--wizschoolLightColor02);
    }
    .ace-wizschool-light .ace_invisible {
      color: var(--wizschoolLightColorBracket);
    }
    .ace-wizschool-light .ace_constant.ace_character,
    .ace-wizschool-light .ace_constant.ace_other {
      color: var(--wizschoolLightColor06);
    }
    .ace-wizschool-light .ace_constant.ace_numeric {
      color: var(--wizschoolLightColor05);
    }
    .ace-wizschool-light .ace_entity.ace_other.ace_attribute-name,
    .ace-wizschool-light .ace_support.ace_constant,
    .ace-wizschool-light .ace_support.ace_function {
      color: var(--wizschoolLightColorFold);
    }
    .ace-wizschool-light .ace_fold {
      background-color: var(--wizschoolLightColor01);
      border-color: var(--wizschoolLightColorFold);
    }
    .ace-wizschool-light .ace_entity.ace_name.ace_tag,
    .ace-wizschool-light .ace_support.ace_class,
    .ace-wizschool-light .ace_support.ace_type {
      color: var(--wizschoolLightColor02);
    }
    .ace-wizschool-light .ace_storage {
      color: var(--wizschoolLightColor01);
    }
    .ace-wizschool-light .ace_string {
      color: var(--wizschoolLightColor03);
    }
    .ace-wizschool-light .ace_comment {
      color: var(--wizschoolLightColor04);
    }
    .ace-wizschool-light .ace_indent-guide {
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAE0lEQVQImWP4////f4bLly//BwAmVgd1/w11/gAAAABJRU5ErkJggg==)
        right repeat-y;
    }
    
    `);
  var r = e("../lib/dom");
  r.importCssString(t.cssText, t.cssClass);
});
(function () {
  window.require(["ace/theme/wizschool-light"], function (m) {
    if (typeof module == "object" && typeof exports == "object" && module) {
      module.exports = m;
    }
  });
})();
