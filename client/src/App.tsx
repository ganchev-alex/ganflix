import {
  createBrowserRouter,
  createHashRouter,
  RouterProvider,
} from "react-router-dom";

import RootLayout from "./layouts/base/RootLayout";
import LandingSection from "./components/landing/LandingSection";
import ExploreSection from "./components/explore/ExploreSection";
import MediaSection from "./components/media/MediaSection";

import "./scss/styles.scss";
import Stream from "./components/stream/Stream";
import Catalogues from "./components/catalogue/Catalogues";

const router = createHashRouter([
  {
    path: "",
    element: <RootLayout />,
    children: [
      {
        path: "",
        element: <LandingSection />,
      },
      {
        path: "explore",
        element: <ExploreSection />,
      },
      {
        path: "movies",
        element: <MediaSection />,
      },
      {
        path: "series",
        element: <MediaSection />,
      },
      {
        path: "catalogues/:name",
        element: <Catalogues />,
      },
    ],
  },
  {
    path: "stream/:indicator",
    element: <Stream />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
