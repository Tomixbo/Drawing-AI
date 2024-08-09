import cv2 as cv
import numpy as np
from PIL import Image
from diffusers import (AutoPipelineForImage2Image, StableDiffusionControlNetPipeline,
                       ControlNetModel)
import torch
# from xformers.ops import MemoryEfficientAttentionFlashAttentionOp


def choose_device(torch_device = None):
    print('...Is CUDA available in your computer?',\
          '\n... Yes!' if torch.cuda.is_available() else "\n... No D': ")
    print('...Is MPS available in your computer?',\
          '\n... Yes' if torch.backends.mps.is_available() else "\n... No D':")

    if torch_device is None:
        if torch.cuda.is_available():
            torch_device = "cuda"
            torch_dtype = torch.float16
        elif torch.backends.mps.is_available() and not torch.cuda.is_available():
            torch_device = "mps"
            torch_dtype = torch.float16
        else:
            torch_device = "cpu"
            torch_dtype = torch.float32

    print("......using ", torch_device)

    return torch_device, torch_dtype

TORCH_DEVICE, TORCH_DTYPE     = choose_device()


# MODELS
MODEL                         = "realistic_vision"
CANNY                         = True
SDXLTURBO_MODEL               = 'c:/Users/tomixbo/Documents/Tombo_personnal/models/sdxl-turbo'
LCM_MODEL                     = 'c:/Users/tomixbo/Documents/Tombo_personnal/models/LCM_Dreamshaper_v7'
REALISTIC_MODEL               = "c:/Users/tomixbo/Documents/Tombo_personnal/models/Realistic_Vision_V6.0_B1_noVAE"
CONTROLNET_CANNY_LOCATION     = "c:/Users/tomixbo/Documents/Tombo_personnal/models/control_v11p_sd15_canny" 
CONTROLNET_CANNYSEG_LOCATION  = "c:/Users/tomixbo/Documents/Tombo_personnal/models/control_v11p_sd15_seg" 


# HYPERPARAMETERS
GUIDANCE_SCALE                = 0. # 0. for sdxl turbo (hardcoded already)
INFERENCE_STEPS               = 30 # 4 for lcm (high quality) # 2 for turbo # 25 for realistic_vision
STRENGH                       = 1. # 0.-1.
RANDOM_SEED                   = 21
HEIGHT                        = 512 #512 #384 #512
WIDTH                         = 512 #512 #384 #512
# FOR CONTROLNET
CONDITIONING_SCALE            = 0.8 # 0.8 # 0.5 works well too
GUIDANCE_START                = 0.
GUIDANCE_END                  = 1. 

def select_model():
    if MODEL == "lcm":
        return LCM_MODEL
    elif MODEL == "realistic_vision":
        return REALISTIC_MODEL
    elif MODEL == "sdxlturbo":
        return SDXLTURBO_MODEL

def prepare_seed():
    generator = torch.manual_seed(RANDOM_SEED)
    return generator

def convert_numpy_image_to_pil_image(image):
    return Image.fromarray(image)

def process_canny(image, lower_threshold = 80, upper_threshold = 80, aperture=3): 
    image = np.array(image)
    image = cv.Canny(image, lower_threshold, upper_threshold,apertureSize=aperture)
    image = np.repeat(image[:, :, np.newaxis], 3, axis=2)
    return image

def process(image):
    return image

def prepare_pipeline(model_name=select_model(), with_canny=CANNY):
    if with_canny:

        controlnet = ControlNetModel.from_pretrained(CONTROLNET_CANNY_LOCATION, torch_dtype=TORCH_DTYPE,
                                                use_safetensors=True)
        # controlnetseg = ControlNetModel.from_pretrained(CONTROLNET_CANNYSEG_LOCATION, torch_dtype=TORCH_DTYPE, use_safetensors=True)
    
        pipeline = StableDiffusionControlNetPipeline.from_pretrained(model_name,
                                                        controlnet=controlnet, 
                                                        # unet=unet,
                                                        torch_dtype=TORCH_DTYPE, safety_checker=None).to(TORCH_DEVICE)
        
        # pipeline.enable_xformers_memory_efficient_attention(attention_op=MemoryEfficientAttentionFlashAttentionOp)

        # Workaround for not accepting attention shape using VAE for Flash Attention

        # pipeline.vae.enable_xformers_memory_efficient_attention(attention_op=None)

    else:

        pipeline = AutoPipelineForImage2Image.from_pretrained(model_name, torch_dtype=TORCH_DTYPE,safety_checker=None).to(TORCH_DEVICE)
        # pipeline.enable_xformers_memory_efficient_attention(attention_op=MemoryEfficientAttentionFlashAttentionOp)

        # Workaround for not accepting attention shape using VAE for Flash Attention

        # pipeline.vae.enable_xformers_memory_efficient_attention(attention_op=None)

    return pipeline

def run_model_canny(pipeline, ref_image, prompt):
    generator = prepare_seed()
    gen_image = pipeline(prompt                        = prompt,
                         num_inference_steps           = INFERENCE_STEPS, 
                         guidance_scale                = GUIDANCE_SCALE,
                         width                         = WIDTH, 
                         height                        = HEIGHT, 
                         generator                     = generator,
                         image                         = ref_image, 
                         controlnet_conditioning_scale = CONDITIONING_SCALE, 
                         control_guidance_start        = GUIDANCE_START, 
                         control_guidance_end          = GUIDANCE_END, 
                         strength = STRENGH,
                        ).images[0]

    return gen_image

def run_model(pipeline, ref_image, prompt):
    generator = prepare_seed()
    gen_image = pipeline(prompt                        = prompt,
                         num_inference_steps           = INFERENCE_STEPS, 
                         guidance_scale                = 0.0 ,
                         width                         = WIDTH, 
                         height                        = HEIGHT, 
                         generator                     = generator,
                         image                         = ref_image, 
                         strength                      = STRENGH,
                        ).images[0]
                        
    return gen_image

def run(pipeline, img, prompt, guidance_scale=0.0, inference_steps=30, strength=0.5, random_seed=21, conditioning_scale=0.8, guidance_start=0.0, guidance_end=1.0):
    # Prepare the seed generator
    generator = torch.manual_seed(random_seed)
    
    # Select the image processing function
    processor = process_canny if CANNY else process
    
    # Convert the numpy image to a PIL image
    numpy_image = processor(img)
    pil_image = convert_numpy_image_to_pil_image(numpy_image)

    # Run the model
    if CANNY:
        gen_image = pipeline(
            prompt=prompt,
            num_inference_steps=inference_steps,
            guidance_scale=guidance_scale,
            width=WIDTH,
            height=HEIGHT,
            generator=generator,
            image=pil_image,
            controlnet_conditioning_scale=conditioning_scale,
            control_guidance_start=guidance_start,
            control_guidance_end=guidance_end,
            strength=strength
        ).images[0]
    else:
        gen_image = pipeline(
            prompt=prompt,
            num_inference_steps=inference_steps,
            guidance_scale=guidance_scale,
            width=WIDTH,
            height=HEIGHT,
            generator=generator,
            image=pil_image,
            strength=strength
        ).images[0]
    
    return gen_image




