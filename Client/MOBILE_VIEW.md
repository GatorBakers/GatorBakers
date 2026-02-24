# Mobile Support Guide

This project uses separate component trees for desktop and mobile rather than pure CSS responsive design. Each page checks the viewport width at runtime and renders the appropriate version.

## How It Works

- `src/hooks/useIsMobile.ts` exposes a `useIsMobile()` hook that returns `true` when the viewport is **768px or narrower**.
- `MainLayout.tsx` uses the hook to swap the top `Navbar` (desktop) for a fixed bottom `MobileNavbar` (mobile).
- Each page calls `useIsMobile()` and delegates to its mobile counterpart when on a small screen.

## Adding a New Page

Follow these steps whenever you create a new page that needs a mobile version.

### 1. Create the desktop page

Add your page component in `src/pages/` as usual (e.g. `SearchPage.tsx`). Build it for desktop first.

### 2. Create the mobile page

Add a mobile version in `src/pages/mobile/` (e.g. `MobileSearchPage.tsx`) with its own CSS file. Keep the same data props so the desktop page can pass data straight through.

### 3. Wire up the hook in the desktop page

In your desktop page component, call `useIsMobile()` and return the mobile version early when `true`:

```tsx
import { useIsMobile } from '../hooks/useIsMobile';
import MobileSearchPage from './mobile/MobileSearchPage';

const SearchPage = () => {
    const isMobile = useIsMobile();

    if (isMobile) {
        return <MobileSearchPage /* pass shared data/props here */ />;
    }

    return (
        // desktop layout
    );
};

export default SearchPage;
```