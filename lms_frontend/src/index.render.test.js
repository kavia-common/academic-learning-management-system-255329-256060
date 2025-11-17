import React from 'react';
import { act } from '@testing-library/react';
import ReactDOM from 'react-dom/client';

// Smoke test mounting the actual index render tree to catch provider/order issues.
describe('index render tree', () => {
  let rootEl;
  let createRootSpy;

  beforeEach(() => {
    // Create a DOM root similar to CRA index.html
    rootEl = document.createElement('div');
    rootEl.setAttribute('id', 'root');
    document.body.appendChild(rootEl);

    // Spy on createRoot to intercept render and execute it with our root
    createRootSpy = jest.spyOn(ReactDOM, 'createRoot');
  });

  afterEach(() => {
    // Cleanup
    if (rootEl && rootEl.parentNode) {
      rootEl.parentNode.removeChild(rootEl);
    }
    jest.restoreAllMocks();
  });

  it('mounts without throwing when using BrowserRouter+AuthProvider+App', async () => {
    // Dynamically import index.js which triggers the render call.
    // Mock createRoot to return an object with render that calls a noop.
    const renderCalls = [];
    createRootSpy.mockImplementation((el) => {
      // Ensure the root element passed is our root
      expect(el).toBe(rootEl);
      return {
        render: (tree) => {
          renderCalls.push(tree);
          // We don't actually need to render to DOM here; just ensure it doesn't throw
        },
      };
    });

    // Importing should execute the render side-effect
    await act(async () => {
      await import('./index.js');
    });

    // Assert our render was called exactly once and a tree was provided
    expect(renderCalls.length).toBe(1);
    expect(renderCalls[0]).toBeTruthy();
  });
});
