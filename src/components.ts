
import components from "./assets/Components.json";
type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;


export interface CodeBuilderShortcuts {
  keys: string[];
  component_id: number;
}
interface Event {
  name: string;
  description?: string | undefined;
  syntax?: string | undefined;
}
interface Slot {
  name: string;
  description?: string | undefined;
  template?: string | undefined;
}
interface Expose {
  name: string;
  description?: string | undefined;
}
interface Snippet {
  title: string;
  content?: string | undefined;
  code?: string | undefined;
  imports: Array<string> | undefined
}
interface Param {
  name?: string;
  type?: string | undefined;
  default?: string | undefined;
  params?: Param[] | undefined;
}
interface Property {
  name: string;
  type?: string | undefined;
  default?: string | undefined;
  description?: string | undefined;
  required?: boolean | undefined;
  template?: string | undefined;
  example?: string | undefined;
  params?: Array<Partial<Param>> | undefined;
}
export type Tab = {
  id: number;
  name: string;
  description?: string;
  template?: string | undefined;
  example?: string | undefined;
  type: string;
  category: string;
  path: string;
  pathtype: string;
  params?: Array<Partial<Param>>;
  slots?: Array<Partial<Slot>>;
  events?: Array<Partial<Event>>;
  props: Array<Partial<Property>>;
  snippets?: Array<Partial<Snippet>>;
  exposes?: Array<Partial<Expose>>;
  codebuilder_shortcuts?: Array<CodeBuilderShortcuts>
};

const RefactorComponent = (component: ArrayElement<typeof components.components>) => {
return JSON.parse(JSON.stringify(component)
    .replace(/\{COMPONENT\}/g, component.name)
    .replace(/\{COMPONENT=(\d+)\}/g, (pMatch, pID) => {
    const referencedComponent = components.components.find(c => c.id === parseInt(pID));
    return referencedComponent ? referencedComponent.name : pMatch;
    }));
}
  

const checkForDuplicates = (component: ArrayElement<typeof components.components>): void => {
  const findDuplicates = (
    array: Partial<{ name: string; title: string }>[],
    prop: string = "name",
  ): string[] => {
    const names = array.map((item: any) => item[prop]);
    const uniqueNames = new Set(names);
    const duplicates: string[] = [];

    uniqueNames.forEach((name) => {
      const count = names.filter((n) => n === name).length;
      if (count > 1 && name) {
        duplicates.push(name);
      }
    });

    return duplicates;
  }


  const duplicateProps = component.props ? findDuplicates(component.props) : [];
  const duplicateSnippets = component.snippets
    ? findDuplicates(component?.snippets, "title")
    : [];
  const duplicateExposes = component.exposes
    ? findDuplicates(component.exposes)
    : [];
  const duplicateSlots = component.slots ? findDuplicates(component.slots) : [];
  const duplicateEvents = component.events
    ? findDuplicates(component.events)
    : [];
  const duplicateParams = component.params
    ? findDuplicates(component.params)
    : [];

  if (duplicateProps.length > 0) {
    console.error(
      `Duplicate props found in component: ${component.name
      }\nDuplicate prop names: ${duplicateProps.join(", ")}`,
    );
  }

  if (duplicateSnippets.length > 0) {
    console.error(
      `Duplicate snippets found in component: ${component.name
      }\nDuplicate snippet names: ${duplicateSlots.join(", ")}`,
    );
  }

  if (duplicateExposes.length > 0) {
    console.error(
      `Duplicate exposes found in component: ${component.name
      }\nDuplicate expose names: ${duplicateSlots.join(", ")}`,
    );
  }

  if (duplicateSlots.length > 0) {
    console.error(
      `Duplicate slots found in component: ${component.name
      }\nDuplicate slot names: ${duplicateSlots.join(", ")}`,
    );
  }

  if (duplicateEvents.length > 0) {
    console.error(
      `Duplicate events found in component: ${component.name
      }\nDuplicate event names: ${duplicateEvents.join(", ")}`,
    );
  }

  if (duplicateParams.length > 0) {
    console.error(
      `Duplicate params found in component: ${component.name
      }\nDuplicate param names: ${duplicateParams.join(", ")}`,
    );
  }
}

export const generateImportString = (pComponent: Partial<Tab>) => {
  const { pathtype, path, name } = pComponent;
  return `import ${pathtype === 'Direct' || !pathtype ? name : `{ ${name} }`} from '${path}'`
}


const vComponentRegex = /\{COMPONENT\}/g;
const vComponentReferenceRegex = /{COMPONENT=(\d+)}/g;

const Components: Tab[] = components.components.map((pComponent) => {
  checkForDuplicates(pComponent);

  return {
    ...RefactorComponent(pComponent),
    snippets: pComponent?.snippets.map((pSnippet) => {
      const vImportPaths: string[] = [];

      const addImportPath = (pComponentToAdd: ArrayElement<typeof components.components>) => {
        const vPath = generateImportString(pComponentToAdd as Tab);
        if (!vImportPaths.includes(vPath)) {
          vImportPaths.push(vPath)
        }
      } 

      return {
        ...pSnippet,
        code: pSnippet?.code.replace(vComponentRegex, () => {
          addImportPath(pComponent);
          return pComponent.name;
        }).replace(vComponentReferenceRegex, (pMatch, pID) => {
          const vReferencedComponent = components.components.find(c => c.id === parseInt(pID));
          if (vReferencedComponent) {
            addImportPath(vReferencedComponent)
            return vReferencedComponent.name
          }
          return pMatch;
        }),
        imports: vImportPaths,
      }
    }),
  };
});

export default Components;