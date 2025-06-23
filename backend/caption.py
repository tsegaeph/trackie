import sys
from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration

def caption(image_path):
    processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
    model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")
    image = Image.open(image_path).convert('RGB')
    inputs = processor(image, return_tensors="pt")
    out = model.generate(**inputs)
    print(processor.decode(out[0], skip_special_tokens=True))

if __name__ == "__main__":
    caption(sys.argv[1])