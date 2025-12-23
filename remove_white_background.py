from PIL import Image, ImageDraw
import os

def remove_white_background_and_round(image_path):
    """Remplace le fond blanc par un fond transparent et arrondit les coins"""
    img = Image.open(image_path)
    img = img.convert("RGBA")
    
    # Étape 1: Supprimer le fond blanc
    datas = img.getdata()
    newData = []
    threshold = 240
    
    for item in datas:
        # Si le pixel est blanc ou presque blanc, le rendre transparent
        if item[0] > threshold and item[1] > threshold and item[2] > threshold:
            newData.append((255, 255, 255, 0))  # Transparent
        else:
            newData.append(item)
    
    img.putdata(newData)
    
    # Étape 2: Créer un masque avec coins arrondis
    mask = Image.new('L', img.size, 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle([(0, 0), img.size], radius=15, fill=255)
    
    # Étape 3: Combiner le canal alpha existant avec le masque arrondi
    alpha = img.split()[3]  # Récupérer le canal alpha actuel
    # Multiplier les deux masques (transparence ET coins arrondis)
    new_alpha = Image.new('L', img.size)
    for i in range(img.size[0] * img.size[1]):
        x = i % img.size[0]
        y = i // img.size[0]
        # Prendre le minimum des deux valeurs alpha
        alpha_val = min(alpha.getpixel((x, y)), mask.getpixel((x, y)))
        new_alpha.putpixel((x, y), alpha_val)
    
    # Appliquer le nouveau canal alpha
    img.putalpha(new_alpha)
    
    img.save(image_path, "PNG")
    print(f"✓ Traité: {os.path.basename(image_path)}")

def process_all_images():
    """Traite toutes les images PNG dans le dossier assets"""
    assets_path = os.path.join(os.path.dirname(__file__), 'src', 'assets')
    
    if not os.path.exists(assets_path):
        print(f"Erreur: Le dossier {assets_path} n'existe pas")
        return
    
    png_files = [f for f in os.listdir(assets_path) if f.endswith('.png')]
    
    if not png_files:
        print("Aucun fichier PNG trouvé dans le dossier assets")
        return
    
    print(f"Traitement de {len(png_files)} images...")
    print("-" * 50)
    
    for filename in png_files:
        image_path = os.path.join(assets_path, filename)
        try:
            remove_white_background_and_round(image_path)
        except Exception as e:
            print(f"✗ Erreur pour {filename}: {str(e)}")
    
    print("-" * 50)
    print(f"Terminé! {len(png_files)} images traitées")

if __name__ == "__main__":
    process_all_images()
