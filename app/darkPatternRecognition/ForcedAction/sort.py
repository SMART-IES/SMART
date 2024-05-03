import os
import shutil
from PIL import Image

def resize_image_to_fit(image, width):
    aspect_ratio = width / float(image.size[0])
    height = int(float(image.size[1]) * aspect_ratio)
    return image.resize((width, height), Image.ANTIALIAS)

def sort_images(source_folder):
    # Define destination folders
    folder_names = ['absent', 'present']
    destination_folders = [os.path.join(source_folder, folder) for folder in folder_names]

    # Create destination folders if they don't exist
    for folder in destination_folders:
        if not os.path.exists(folder):
            os.makedirs(folder)

    # Get the width of the monitor
    monitor_width = 1920  # You can replace this with the actual width of your monitor

    # Traverse through all subfolders in the source folder
    for root, dirs, files in os.walk(source_folder):
        for file in files:
            if (file.endswith('.png') == True):
                image_path = os.path.join(root, file)
                # Open and resize the image
                image = Image.open(image_path)
                resized_image = resize_image_to_fit(image, monitor_width)

                # Display the image
                resized_image.show()

                print("Sorting", file)
                # Prompt user to select destination folder
                while True:
                    print("Select a folder to move the image to:")
                    for i, folder_name in enumerate(folder_names):
                        print(f"{i + 1}. {folder_name}")
                    choice = input("Enter your choice (1-2): ")
                    if choice.isdigit() and 1 <= int(choice) <= 2:
                        break
                    else:
                        print("Invalid choice. Please enter a number between 1 and 2.")

                # Close the image
                resized_image.close()

                # Move the file to the selected folder
                destination_folder = destination_folders[int(choice) - 1]
                shutil.move(image_path, os.path.join(destination_folder, file))
                print("Moved to", destination_folder)

if __name__ == "__main__":
    source_folder = input("Enter the path to the source folder: ")
    sort_images(source_folder)
