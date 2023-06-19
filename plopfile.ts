import { ActionType, NodePlopAPI } from "plop";
import { join } from "path";
import camelcase from "camelcase";

export default (plop: NodePlopAPI) => {
  plop.setGenerator("component", {
    description: "Create a component",
    prompts: [
      {
        type: "list",
        name: "dir",
        message: "Select component directory",
        choices: [
          "component",
          "component/ui",
          "component/ui/form",
          "component/ui/global",
        ],
      },
      {
        type: "input",
        name: "name",
        message: "What is component name?",
      },
      {
        type: "confirm",
        name: "hasProps",
        message: "Dose it have props?",
        default: true,
      },
    ],
    actions: (data): ActionType[] => {
      const actions: ActionType[] = [];
      if (!data) return actions;

      const camelName = toCamel(data.name);
      const pascalName = toCamel(data.name, true);

      const path = join("apps/frontend/src/", data.dir, camelName);
      const typeAnnotation = data.hasProps
        ? `NextPage<${pascalName}Props>`
        : "NextPage";
      const propsType = data.hasProps
        ? `\ninterface ${pascalName}Props {};`
        : "";
      const props = data.hasProps ? `(props)` : "{}";

      actions.push(
        {
          type: "add",
          path: `${path}/index.tsx`,
          templateFile: "_templates/component/component.tsx.hbs",
          data: {
            ...data,
            typeAnnotation,
            props,
            propsType,
          },
        },
        {
          type: "add",
          path: `${path}/${camelName}.stories.tsx`,
          templateFile: "_templates/component/component.stories.tsx.hbs",
          data: {
            ...data,
            typeAnnotation,
            props,
            propsType,
          },
        },
        {
          type: "add",
          path: `${path}/${camelName}.spec.tsx`,
          templateFile: "_templates/component/component.spec.tsx.hbs",
          data: {
            ...data,
            typeAnnotation,
            props,
            propsType,
          },
        }
      );

      return actions;
    },
  });
  plop.setGenerator("page", {
    description: "Create a page",
    prompts: [
      {
        type: "input",
        name: "dir",
        message: "What is page path?",
        default: "./",
      },
      {
        type: "input",
        name: "name",
        message: "What is page name?",
      },
    ],
    actions: (data): ActionType[] => {
      const actions: ActionType[] = [];
      if (!data) return actions;

      const camelName = toCamel(data.name);

      const path = join("apps/frontend/src/app/", data.dir, camelName);

      actions.push(
        {
          type: "add",
          path: `${path}/page.tsx`,
          templateFile: "_templates/page/page.tsx.hbs",
          data,
        },
        {
          type: "add",
          path: `${path}/layout.tsx`,
          templateFile: "_templates/page/layout.tsx.hbs",
          data,
        }
      );

      return actions;
    },
  });
};

const toCamel = (str: string, isPascal: boolean = false) =>
  camelcase(str, { pascalCase: isPascal, preserveConsecutiveUppercase: true });
