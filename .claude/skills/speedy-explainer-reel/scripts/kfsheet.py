import sys,glob
from PIL import Image
out,pat,cols=sys.argv[1],sys.argv[2],int(sys.argv[3]); W=int(sys.argv[4]) if len(sys.argv)>4 else 480
fs=sorted(glob.glob(pat),key=lambda f:float(f.rsplit('_',1)[1][:-4])); ims=[Image.open(f).convert('RGB') for f in fs]
h=int(W*ims[0].height/ims[0].width); rows=(len(ims)+cols-1)//cols
s=Image.new('RGB',(cols*W,rows*h))
for i,im in enumerate(ims): s.paste(im.resize((W,h)),((i%cols)*W,(i//cols)*h))
s.save(out,quality=88); print(s.size,len(ims))
