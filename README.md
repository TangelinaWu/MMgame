# MMgame

A simple browser prototype for a vertical merge-cooking game.

## Run locally

Open `/home/runner/work/MMgame/MMgame/index.html` in a browser, or run:

```bash
cd /home/runner/work/MMgame/MMgame
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Gameplay implemented

- Vertical mobile-style single-page layout.
- Customers appear at the top with orders.
- 8x8 kitchen grid where mergeable ingredients are stored.
- Ingredient generators spawn base ingredients into the grid.
- Merge matching ingredients to progress to higher-tier dishes.
- Deliver completed dishes to customers to earn coins and progress levels.
- Levels increase difficulty via more customers and more complex orders.
- Every 20 levels unlocks a new food group generator.
