from pypdf import PdfReader
from pathlib import Path
from PIL import Image,ImageOps,ImageDraw
out=Path('assets/images/pdf');out.mkdir(parents=True,exist_ok=True)
files={'ionprime':'Theben iONPrime Keypad Touchpad KNX .pdf','sul':'SUL 181 D.pdf','sul-sk':'SUL 181 D SK.pdf','tr030':'TR 030 Top3.pdf','tr610':'TR 610 top3.pdf','simplexa':'Simplexa 601 top.pdf'}
thumbs=[]
for slug,name in files.items():
 r=PdfReader(Path('C:/Users/Benaya Arlen/Documents/T2')/name)
 for pi in ([0,1,2,3,10,17,18,19,20,21,22,23,24] if slug=='ionprime' else [0]):
  for ii,img in enumerate(r.pages[pi].images):
   im=img.image.convert('RGB')
   if im.width<100 or im.height<100:continue
   dest=out/f'{slug}-p{pi+1}-i{ii}.webp';im.save(dest,'WEBP',quality=90)
   tile=Image.new('RGB',(240,210),'white');tile.paste(ImageOps.contain(im,(220,170)),(10,5));ImageDraw.Draw(tile).text((8,183),dest.stem,fill='black');thumbs.append(tile)
canvas=Image.new('RGB',(240*5,210*((len(thumbs)+4)//5)), '#ddd')
for i,t in enumerate(thumbs):canvas.paste(t,((i%5)*240,(i//5)*210))
canvas.save('pdf-images-review.jpg');print('extracted',len(thumbs))
