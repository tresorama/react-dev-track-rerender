# react-dev-track-rerender

React Component that Tracks Mount and Rerender


## Basic Usage

Install the package:

```bash
# pnpm
pnpm add @tresorama/react-dev-track-rerender

# npm
npm i @tresorama/react-dev-track-rerender

# yarn
yarn add @tresorama/react-dev-track-rerender
```

Add the global provider to your app and set `isEnabled` to `true` (default is `false`):

```tsx
import { DevTrackReRenderGlobalProvider } from '@tresorama/react-dev-track-rerender';

<DevTrackReRenderGlobalProvider
  isEnabled
>
  <App />
</DevTrackReRenderGlobalProvider>
```


then use the `DevTrackReRender` component in your components:

```tsx
import { DevTrackReRender } from '@tresorama/react-dev-track-rerender';

<DevTrackReRender>
  <div className="flex gap-2">
    <span>hello</span>
  <span>world</span>
</DevTrackReRender>
```

## Good to Know

### Direct child of `DevTrackReRender` must allow unknown props

The `DevTrackReRender` component doesn't create a new DOM element as a wrapper, it uses radix `Slot` component to add props directly to the first child.  
Because of this ensure that the wrapped component (div in the example) will add unknown props to the first child.

```tsx

<DevTrackReRender>
  <MyButton>hello</MyButton>
</DevTrackReRender>

// ✅ correct
const MyButton = ({ children,...props }: React.ComponentProps<'button'>) => (
  <button {...props}>
    {children}
  </button>
)

// ❌ incorrect
const MyButton = ({ children }: { children: React.ReactNode; }) => (
  <button>
    {children}
  </button>
)
```

### You can enable the `DevTrackRerender` component globally

You must explicitly render the `DevTrackRerenderGlobalProvider` once at the root of your app and pass `isEnabled` to `true`.  
Default is `false`.  
When `false` the `DevTrackRerender` component will render the children directly.

## Limitations

### When `React.StricMode` is enabled, mount renders are not made visible in the UI

If `React.StrictMode` is enabled, you cannot see the monut event in the UI.  
In order to see the mount event, disable `React.StrictMode` in your app while debugging rerenders, then re-enable it when you are done.  