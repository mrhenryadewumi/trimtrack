with open(r'C:\Users\mrhen\trimtrack\app\globals.css', 'r', encoding='utf-8') as f:
    d = f.read()

mobile_css = """
/* Mobile-first fixes */
* {
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

html, body {
  overflow-x: hidden;
  max-width: 100vw;
}

input, button, select, textarea {
  font-size: 16px !important; /* Prevents iOS zoom on focus */
  max-width: 100%;
}

img {
  max-width: 100%;
  height: auto;
}

/* Touch-friendly buttons */
button {
  min-height: 44px;
  cursor: pointer;
}

/* Smooth scrolling */
* {
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}
"""

if "Mobile-first fixes" not in d:
    d = d + mobile_css
    print("Mobile CSS added")
else:
    print("Mobile CSS already present")

with open(r'C:\Users\mrhen\trimtrack\app\globals.css', 'w', encoding='utf-8') as f:
    f.write(d)