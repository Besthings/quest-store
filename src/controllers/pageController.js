// Home page
const getHome = async (req, res) => {
  try {
    const q = req.query.q || "";
    const categoryId = req.query.category || "";
    const filter = req.query.filter || "";

    res.render("home", {
      title: "Quest Store – Premium Game Keys",
      page: "home",
      q,
      categoryId,
      filter,
      // Provide empty arrays/nulls as placeholders to prevent EJS errors during transition if needed
      games: [],
      categories: [],
      isFiltered: !!(q || categoryId || filter),
      categoryName: null
    });
  } catch (error) {
    console.error("Home page error:", error.message);
    res.status(500).send("Server Error: " + error.message);
  }
};

// Login page
const getLogin = (req, res) => {
  if (req.currentUser) {
    return res.redirect("/");
  }
  res.render("login", {
    title: "Login – Quest Store",
    page: "login",
  });
};

// Game details page
const getGameDetails = async (req, res) => {
  try {
    // We just pass the ID and let the frontend fetch via Axios
    res.render("game-details", {
      title: "Game Details – Quest Store",
      page: "game-details",
      gameId: req.params.id,
      // Placeholders to prevent EJS template errors if any
      game: null,
      related: []
    });
  } catch (error) {
    console.error("Game details page error:", error);
    res.status(500).render("404", { title: "Error", page: "404" });
  }
};

// Cart page
const getCart = async (req, res) => {
  try {
    if (!req.currentUser) {
      return res.redirect("/login");
    }

    res.render("cart", {
      title: "Cart – Quest Store",
      page: "cart",
      // Placeholders to prevent EJS template errors
      cartItems: [],
      subtotal: 0,
      tax: 0,
      total: 0,
    });
  } catch (error) {
    console.error("Cart page error:", error);
    res.status(500).render("404", { title: "Error", page: "404" });
  }
};

// Checkout page
const getCheckout = async (req, res) => {
  try {
    if (!req.currentUser) {
      return res.redirect("/login");
    }

    res.render("checkout", {
      title: "Checkout – Quest Store",
      page: "checkout",
      cartItems: [],
      subtotal: 0,
      tax: 0,
      total: 0,
    });
  } catch (error) {
    console.error("Checkout page error:", error);
    res.status(500).render("404", { title: "Error", page: "404" });
  }
};

// Profile page
const getProfile = async (req, res) => {
  try {
    if (!req.currentUser) {
      return res.redirect("/login");
    }

    const tab = req.query.tab || "profile";

    res.render("profile", {
      title: "Profile – Quest Store",
      page: "profile",
      orders: [], // Placeholder
      tab,
    });
  } catch (error) {
    console.error("Profile page error:", error);
    res.status(500).render("404", { title: "Error", page: "404" });
  }
};

// About page
const getAbout = (req, res) => {
  res.render("about", {
    title: "About – Quest Store",
    page: "about",
  });
};

// Admin Dashboard
const getAdminDashboard = async (req, res) => {
  try {
    res.render("admin/dashboard", {
      title: "Dashboard – Admin",
      page: "admin-dashboard",
      layout: "admin-layout",
      // Placeholders to prevent EJS template errors during transition
      games: [],
      orders: [],
      users: [],
    });
  } catch (error) {
    console.error("Admin dashboard page error:", error);
    res.status(500).render("404", { title: "Error", page: "404" });
  }
};

// Admin Users
const getAdminUsers = async (req, res) => {
  try {
    res.render("admin/users", {
      title: "Users – Admin",
      page: "admin-users",
      layout: "admin-layout",
      users: [], // Placeholder
    });
  } catch (error) {
    console.error("Admin users page error:", error);
    res.status(500).render("404", { title: "Error", page: "404" });
  }
};

// Admin Categories
const getAdminCategories = async (req, res) => {
  try {
    res.render("admin/categories", {
      title: "Categories – Admin",
      page: "admin-categories",
      layout: "admin-layout",
      categories: [], // Placeholder
    });
  } catch (error) {
    console.error("Admin categories page error:", error);
    res.status(500).render("404", { title: "Error", page: "404" });
  }
};

// Admin Games
const getAdminGames = async (req, res) => {
  try {
    res.render("admin/games", {
      title: "Games – Admin",
      page: "admin-games",
      layout: "admin-layout",
      games: [], // Placeholder
      categories: [], // Placeholder
    });
  } catch (error) {
    console.error("Admin games page error:", error);
    res.status(500).render("404", { title: "Error", page: "404" });
  }
};

// Admin Orders
const getAdminOrders = async (req, res) => {
  try {
    res.render("admin/orders", {
      title: "Orders – Admin",
      page: "admin-orders",
      layout: "admin-layout",
      orders: [], // Placeholder
    });
  } catch (error) {
    console.error("Admin orders page error:", error);
    res.status(500).render("404", { title: "Error", page: "404" });
  }
};

// Admin Reports
const getAdminReports = async (req, res) => {
  try {
    res.render("admin/reports", {
      title: "Reports – Admin",
      page: "admin-reports",
      layout: "admin-layout",
    });
  } catch (error) {
    console.error("Admin reports page error:", error);
    res.status(500).render("404", { title: "Error", page: "404" });
  }
};

module.exports = {
  getHome,
  getLogin,
  getGameDetails,
  getCart,
  getCheckout,
  getProfile,
  getAbout,
  getAdminDashboard,
  getAdminUsers,
  getAdminCategories,
  getAdminGames,
  getAdminOrders,
  getAdminReports,
};
