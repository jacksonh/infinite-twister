# Infinite Twister

A modern, digital Twister spinner web app that replaces the traditional spinning wheel with an interactive, full-screen experience.

## Features

- **Full-Screen Color Display**: The entire background changes to the selected Twister color (red, yellow, blue, green)
- **Animated Body Part Icons**: Large, clear SVG icons show which body part to use (left/right hand/foot)
- **Realistic Spinning Animation**: Emulates a spinning wheel by cycling through options, starting fast and slowing down
- **Audio Announcements**: Uses text-to-speech to announce each result (ready for custom audio files)
- **Customizable Pause Duration**: Adjust how long results are displayed (1-10 seconds)
- **Mobile Responsive**: Works great on all device sizes
- **Game Instructions**: Built-in help text explaining how to play
- **Google Ads Ready**: Placeholder for advertisement integration

## How to Play

1. Click "Start Game" to begin
2. Listen for the color and body part announcement
3. Place the specified body part (e.g., "Left Hand") on the specified color on your Twister mat
4. Click "Spin Again" for the next move
5. Keep playing until someone falls!

## Setup Instructions

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Start Development Server**:

   ```bash
   npm start
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

## Adding Custom Audio Files

To replace the text-to-speech with custom audio files:

1. Create an `audio` folder in the `public` directory
2. Add audio files named like: `red-left-hand.mp3`, `blue-right-foot.mp3`, etc.
3. Update the `playAudio` function in `App.js` to load and play these files

Example audio file naming convention:

- `red-left-hand.mp3`
- `red-right-hand.mp3`
- `red-left-foot.mp3`
- `red-right-foot.mp3`
- `yellow-left-hand.mp3`
- (and so on for all 16 combinations)

## Customization Options

- **Colors**: Edit the `COLORS` array in `App.js` to change available colors
- **Animation Speed**: Modify the spin timing in the `spin` function
- **Icon Design**: Update the SVG paths in `renderBodyPartIcon` function
- **Styling**: Customize colors and animations in `App.css` and `index.css`

## Technology Stack

- React 18
- CSS3 Animations
- SVG Graphics
- Web Speech API (for text-to-speech)

## Browser Compatibility

Works in all modern browsers. For audio features, ensure:

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support

Enjoy your digital Twister game! 🌪️
