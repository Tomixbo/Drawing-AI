import cv2 as cv
import numpy as np
from PIL import Image
from diffusers import (AutoPipelineForImage2Image, StableDiffusionControlNetPipeline,
                       ControlNetModel)
import torch


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



MODEL                         = "lcm" #"lcm" # or "sdxlturbo"
SDXLTURBO_MODEL_LOCATION      = 'c:/Users/tomixbo/Documents/Tombo_personnal/models/sdxl-turbo'
LCM_MODEL_LOCATION            = 'c:/Users/tomixbo/Documents/Tombo_personnal/models/LCM_Dreamshaper_v7'
CONTROLNET_CANNY_LOCATION     = "c:/Users/tomixbo/Documents/Tombo_personnal/models/control_v11p_sd15_canny" 
CONTROLNET_CANNYSEG_LOCATION     = "c:/Users/tomixbo/Documents/Tombo_personnal/models/control_v11p_sd15_seg" 
TORCH_DEVICE, TORCH_DTYPE     = choose_device()  
GUIDANCE_SCALE                = 100 # 0 for sdxl turbo (hardcoded already)
INFERENCE_STEPS               = 4 #4 for lcm (high quality) #2 for turbo
DEFAULT_NOISE_STRENGTH        = 1. # 0.5 works well too
CONDITIONING_SCALE            = 0.6 # .5 works well too
GUIDANCE_START                = 0.
GUIDANCE_END                  = 0.8
RANDOM_SEED                   = 21
HEIGHT                        = 512 #512 #384 #512
WIDTH                         = 512 #512 #384 #512
STRENGH                       = 0. #0-1

def prepare_seed():
    generator = torch.manual_seed(RANDOM_SEED)
    return generator

def convert_numpy_image_to_pil_image(image):
    # return Image.fromarray(cv.cvtColor(image, cv.COLOR_BGR2RGB))
    return Image.fromarray(image)

def process_lcm(image, lower_threshold = 100, upper_threshold = 100, aperture=3): 
    # image = np.array(image)
    # image = cv.Canny(image, lower_threshold, upper_threshold,apertureSize=aperture)
    # image = np.repeat(image[:, :, np.newaxis], 3, axis=2)
    return image

def process_sdxlturbo(image):
    return image

def prepare_lcm_controlnet_or_sdxlturbo_pipeline():

    if MODEL=="lcm":

        controlnet = ControlNetModel.from_pretrained(CONTROLNET_CANNY_LOCATION, torch_dtype=TORCH_DTYPE,
                                                use_safetensors=True)
        controlnetseg = ControlNetModel.from_pretrained(CONTROLNET_CANNYSEG_LOCATION, torch_dtype=TORCH_DTYPE,
                                                use_safetensors=True)
    
        pipeline = StableDiffusionControlNetPipeline.from_pretrained(LCM_MODEL_LOCATION,
                                                        controlnet=controlnetseg, 
                                                        # unet=unet,
                                                        torch_dtype=TORCH_DTYPE, safety_checker=None).to(TORCH_DEVICE)

    elif MODEL=="sdxlturbo":

        pipeline = AutoPipelineForImage2Image.from_pretrained(SDXLTURBO_MODEL_LOCATION, torch_dtype=TORCH_DTYPE,safety_checker=None).to(TORCH_DEVICE)
        
    return pipeline

def run_lcm(pipeline, ref_image, prompt):

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

def run_sdxlturbo(pipeline, ref_image, prompt):

    generator = prepare_seed()
    gen_image = pipeline(prompt                        = prompt,
                         num_inference_steps           = INFERENCE_STEPS, 
                         guidance_scale                = 0.0 ,
                         width                         = WIDTH, 
                         height                        = HEIGHT, 
                         generator                     = generator,
                         image                         = ref_image, 
                         strength                      = DEFAULT_NOISE_STRENGTH, 
                        ).images[0]
                        
    return gen_image



def run_lcm_or_sdxl(pipeline, img, prompt):
    
    processor  = process_lcm if MODEL=="lcm" else process_sdxlturbo
    run_model  = run_lcm if MODEL=="lcm" else run_sdxlturbo

    # result_image, masked_image = get_result_and_mask(image, center_x, center_y, WIDTH, HEIGHT)

    numpy_image = processor(img)
    pil_image   = convert_numpy_image_to_pil_image(numpy_image)
    # pil_image_rgb = cv2.cvtColor(pil_image, cv2.COLOR_BGR2RGB)
    result   = run_model(pipeline, pil_image, prompt)

    # result_image = cv.cvtColor(np.array(pil_image_rgb), cv.COLOR_RGB2BGR)

    
    return result



