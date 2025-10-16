// Get the token
export const getToken = () => {
  const userData = JSON.parse(localStorage.getItem('userData')) || {};
  return userData?.token || '';
};

// Get module object or module id by URL
export const getModuleByUrl = (moduleUrl) => {
  const userData = JSON.parse(localStorage.getItem('userData')) || {};
 /* console.log(userData) 
 */
  if (!Array.isArray(userData.employeeRole)) return null;

  for (const role of userData.employeeRole) {
    for (const childMenu of role.childMenus || []) {
      for (const mod of childMenu.modules || []) {
        if (mod.moduleUrl?.toLowerCase() === moduleUrl.toLowerCase()) {
          return mod; // returns the whole module object
        }
      }
    }
  }
  return null; // not found
};

// Shortcut to get only module id
export const getModuleId = (moduleUrl) => {
  const module = getModuleByUrl(moduleUrl);
  return module?.id || null;
};

// Shortcut to get module permissions
export const getModulePermissions = (moduleUrl) => {
  const module = getModuleByUrl(moduleUrl);
  return module?.permission?.toLowerCase().split(',').map(p => p.trim()) || [];
};
