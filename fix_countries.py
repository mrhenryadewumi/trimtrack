import re

# Fix profile page country list
with open(r'C:\Users\mrhen\trimtrack\app\profile\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

old = 'const COUNTRIES = ["Nigeria","UK","USA","Canada","Ghana","South Africa","Australia","Germany","Other"];'

new = '''const COUNTRIES = [
  "Nigeria", "Ghana", "Kenya", "South Africa", "Ethiopia", "Tanzania", "Uganda",
  "Rwanda", "Cameroon", "Ivory Coast", "Senegal", "Mali", "Burkina Faso", "Niger",
  "Chad", "Sudan", "Somalia", "Mozambique", "Madagascar", "Zimbabwe", "Zambia",
  "Malawi", "Botswana", "Namibia", "Angola", "Democratic Republic of Congo",
  "Republic of Congo", "Gabon", "Equatorial Guinea", "Benin", "Togo", "Sierra Leone",
  "Liberia", "Guinea", "Guinea-Bissau", "Gambia", "Cape Verde", "Mauritania",
  "Morocco", "Algeria", "Tunisia", "Libya", "Egypt", "Eritrea", "Djibouti",
  "Comoros", "Seychelles", "Mauritius", "Sao Tome and Principe", "Lesotho", "Eswatini",
  "UK", "USA", "Canada", "Australia", "Germany", "France", "Italy", "Spain",
  "Netherlands", "Belgium", "Sweden", "Norway", "Denmark", "Finland", "Switzerland",
  "Austria", "Portugal", "Ireland", "New Zealand", "Brazil", "Jamaica", "Trinidad",
  "Barbados", "Guyana", "UAE", "Saudi Arabia", "Qatar", "Kuwait", "Bahrain",
  "India", "China", "Japan", "South Korea", "Singapore", "Malaysia", "Other"
];'''

if old in d:
    d = d.replace(old, new)
    print("Profile COUNTRIES updated")
else:
    print("Profile pattern not found")
    idx = d.find("COUNTRIES")
    print(repr(d[idx:idx+100]))

with open(r'C:\Users\mrhen\trimtrack\app\profile\page.tsx', 'w', encoding='utf-8') as f:
    f.write(d)