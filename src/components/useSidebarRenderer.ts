import { ref, computed, h } from "vue";
const groupByCategoryPath = (objects: any[]) => {
  const grouped: any[] = [];
  const visited = new Set();

  objects.forEach((obj) => {
    if (visited.has(obj)) return; // Skip if already visited
    visited.add(obj);

    const categories = obj.category.split("/");
    let currentGroup: Array<any> = grouped;

    categories.forEach((category: string, index: number) => {
      const foundCategory = currentGroup.find(
        (item) => item.category === category
      );

      if (!foundCategory) {
        const newCategory = { category, children: [] };
        currentGroup.push(newCategory);
        currentGroup = newCategory?.children;
      } else {
        currentGroup = foundCategory?.children;
      }

      if (index === categories.length - 1) {
        currentGroup.push(obj);
      }
    });
  });

  return grouped;
};

export default function useSidebarRenderer(objects: any[]) {
  const groupedObjects = ref<any[]>([]);

  // Group the objects when component is created
  groupedObjects.value = groupByCategoryPath(objects);

  // Render the sidebar recursively
  const renderSidebar = (items: any[]): any => {
    return items.map((item) => {
      if (item.children) {
        return h("li", { key: item.category }, [
          item?.category,
          h("ul", renderSidebar(item.children)),
        ]);
      } else {
        return h("li", { key: item.name }, item.name);
      }
    });
  };

  // Computed property to get the sidebar
  const sidebar = computed(() => {
    return h("ul", renderSidebar(groupedObjects.value));
  });

  return {
    sidebar,
  };
}
